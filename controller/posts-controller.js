const Post = require('../models/post.model');
const PostQueue = require('../models/postqueue.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const ReportedComment = require('../models/reported-comment.model');


exports.getPosts = (req, res) => {

  Post.find( (err, posts) => {

    if (err) return res.status(400).json({ message: 'Error finding Posts'});
    if (!posts) return res.status(400).json({ message: 'There are no posts with that ID'});
    console.log('Getting all Posts');
    return res.status(200).json(posts);
  })
}

exports.getPostInfo = (req, res) => {

  let id = req.body._id;

  if (!id ) return res.status(400).json({message: 'The request body did not have an _id'})
  Post.findById( id, (err, post) => {

    if (err) return res.status(400).json({ message: 'Error finding Post'});
    if (!post) return res.status(400).json({ message: 'There are no posts with that ID'});
    console.log('Getting all Posts');
    return res.status(200).json(post);
  })
}

// Adding a Post involves being added to the PostQueue first
// Admin has access to PostQueue for verification
// Admin sends verified posts to Post collection.
exports.addTextPost = (req, res) => {

  if (!req.body.creatorName || !req.body.creatorEmail || !req.body.post) {
    console.log('Please enter a creator name, creator email, and a post');
    return res.status(200).json({message: 'Please enter a creator name, creator email, and a post'});
  }

  // Add Current Date to Post
  req.body.date = Date.now()
  let newPost = PostQueue(req.body);

  newPost.save( (err, post) => {
    if (err) {
      return res.status(400).json({message: 'There was an error saving the post to the database', error:  err});
    }

    console.log('Added Text Post to PostQueue: ' + post);
    return res.status(200).json(post);
  })
}

exports.addVideoPosts = (req, res) => {

  if (!req.body.creatorName || !req.body.creatorEmail || !req.body.post) {
    console.log('Please enter a creator name, creator email, and a post');
    return res.status(200).json({message: 'Please enter a creator name, creator email, and a post'});
  }

  // Add Current Date to Post
  req.body.date = Date.now()

  let newPost = PostQueue(req.body);

  newPost.save( (err, post) => {
    if (err) {
      return res.status(400).json({message: 'There was an error saving the pody to the database: \n\n' + err});
    }


    console.log('Added Video Post to PostQueue: ' + post);
    return res.status(200).json(post);
  })
}

exports.addPhotoPosts = (req, res) => {

  if (!req.body.creatorName || !req.body.creatorEmail || !req.body.post) {
    console.log('Please enter a creator name, creator email, and a post');
    return res.status(200).json({message: 'Please enter a creator name, creator email, and a post'});
  }

  // Add Current Date to Post
  req.body.date = Date.now()

  let newPost = PostQueue(req.body);

  newPost.save( (err, post) => {
    if (err) {
      return res.status(400).json({message: 'There was an error saving the post to the database: \n\n' + err});
    }


    console.log('Added Photo Post to PostQueue: ' + post);
    return res.status(200).json(post);
  })
}

exports.upVotePost = async (req, res) => {
  console.log(req.body.postID);
  console.log(req.body.userEmail);
  console.log('Upvote API...')

   // See if Request Body has Post ID and UserEmail
  if ( !req.body.postID || !req.body.userEmail) return res.status(400).json({message: 'There is no post ID or userEmail in request'})

  let postID = req.body.postID;
  let userEmail = req.body.userEmail;

  // If User has not upvoted already continue
  await Post.findOne({
    _id: postID,
    'upvoters': userEmail
  }, (err, data) => {
    // Check if user has already Upvoted
    console.log('Checking to see if this user has already Upvoted..');
    if (err) return res.status(400).json({message: 'There was an error find a user with that email'});
    if (data) {
      console.log(data);
      console.log('This User has already Upvoted')
      return res.status(400).json({message: 'This user has already Upvoted'});
    }
      // If User has not upvoted already continue
    if (!data) {
      console.log(`User with ${userEmail} has never upvoted this post`);
    }

      // Check to see if user has downvoted
      console.log('Checking to see if this user has already Downvoted this post...');

      Post.findOne({
        _id: postID,
        'downvoters': userEmail
      },
      (err, data) => {
        if (err) return res.status(400).json({message: 'There was an error find a user with that email'});

        // User Never Downvoted
        if (!data) {
          console.log(`This user has not already downvoted`);

          // inc 1 to UPVOTES
          // Add UserEmail to UPVOTERS
          Post.updateOne({
            _id: postID,
            },
            { $inc: { 'upvotes': 1 }
            },
            (err, data) => {
              if (err) return res.status(400).json({message: 'err', error: err})
              if (!data) return res.status(400).json({message: 'There was no post with that ID'});
              if (data) console.log(data);
            }
          )

          Post.updateOne({
            _id: postID,
            },
            { $push: { 'upvoters': userEmail }
            },
            (err, data) => {
              if (err) return res.status(400).json({message: 'err', error: err})
              if (!data) return res.status(400).json({message: 'There was no post with that ID'});
              if (data) console.log(data);
            }
          )
          return res.status(200).json({message: 'upvoted'});

        }
        // User Downvoted Previously
        if (data) {
          console.log(`This user has already downvoted`);

          // inc -1 from DOWNVOTES
          // pull email from DOWNVOTERS
          // inc 1 to UPVOTES
          // Add UserEmail to UPVOTERS
          Post.updateOne({
            _id: postID,
            },
            { $inc: { 'downvotes': -1 }
            },
            (err, data) => {
              if (err) return res.status(400).json({message: 'err', error: err})
              if (!data) return res.status(400).json({message: 'There was no post with that ID'});
              if (data) console.log(data);
            }
          )

          Post.updateOne({
            _id: postID,
            },
            { $pull: { 'downvoters': userEmail }
            },
            (err, data) => {
              if (err) return res.status(400).json({message: 'err', error: err})
              if (!data) return res.status(400).json({message: 'There was no post with that ID'});
              if (data) console.log(data);
            }
          )

          Post.updateOne({
            _id: postID,
            },
            { $inc: { 'upvotes': 1 }
            },
            (err, data) => {
              if (err) return res.status(400).json({message: 'err', error: err})
              if (!data) return res.status(400).json({message: 'There was no post with that ID'});
              if (data) console.log(data);
            }
          )

          Post.updateOne({
            _id: postID,
            },
            { $push: { 'upvoters': userEmail }
            },
            (err, data) => {
              if (err) return res.status(400).json({message: 'err', error: err})
              if (!data) return res.status(400).json({message: 'There was no post with that ID'});
              if (data) console.log(data);
            }
          )

          return res.status(200).json({message: 'upvoted'});
        }
      })
    }
  )
}

exports.downVotePost = async (req, res) => {
  console.log(req.body.postID);
  console.log(req.body.userEmail);
  console.log('Downvote API...')

  if ( !req.body.postID || !req.body.userEmail) return res.status(400).json({message: 'There is no post ID or userEmail in request'})

  let postID = req.body.postID;
  let userEmail = req.body.userEmail;

  // If User has not downvoted already continue
  await Post.findOne({
    _id: postID,
    'downvoters': userEmail
  }, (err, data) => {
    if (err) return res.status(400).json({message: 'There was an error find a user with that email'});

    if (data) {
      console.log('This User has already Downvoted')
      return res.status(400).json({message: 'This user has already Downvoted'});
    }
    if (!data) console.log(`User with ${userEmail} has never Downvoted this post`);

    // Check to see if user has Upvoted
    console.log('Checking to see if this user has already Upvoted this post...');

    Post.findOne({
      _id: postID,
      'upvoters': userEmail
    },
    (err, data) => {
      if (err) return res.status(400).json({message: 'There was an error find a user with that email'});

      // User Never Upvoted
      if (!data) {
        console.log(`This user has not already upvoted`);

        // inc 1 to DOWNVOTES
        // Add UserEmail to DOWNVOTERS
        Post.updateOne({
          _id: postID,
          },
          { $inc: { 'downvotes': 1 }
          },
          (err, data) => {
            if (err) return res.status(400).json({message: 'err', error: err})
            if (!data) return res.status(400).json({message: 'There was no post with that ID'});
            if (data) console.log(data);
          }
        )

        Post.updateOne({
          _id: postID,
          },
          { $push: { 'downvoters': userEmail }
          },
          (err, data) => {
            if (err) return res.status(400).json({message: 'err', error: err})
            if (!data) return res.status(400).json({message: 'There was no post with that ID'});
            if (data) console.log(data);
          }
        )
        return res.status(200).json({message: 'downvoted'});

      }
      // User Upvoted Previously
      if (data) {
        console.log(`This user has already upvoted`);

        // inc -1 from DOWNVOTES
        // pull email from DOWNVOTERS
        // inc 1 to UPVOTES
        // Add UserEmail to UPVOTERS
        Post.updateOne({
          _id: postID,
          },
          { $inc: { 'upvotes': -1 }
          },
          (err, data) => {
            if (err) return res.status(400).json({message: 'err', error: err})
            if (!data) return res.status(400).json({message: 'There was no post with that ID'});
            if (data) console.log(data);
          }
        )

        Post.updateOne({
          _id: postID,
          },
          { $pull: { 'upvoters': userEmail }
          },
          (err, data) => {
            if (err) return res.status(400).json({message: 'err', error: err})
            if (!data) return res.status(400).json({message: 'There was no post with that ID'});
            if (data) console.log(data);
          }
        )

        Post.updateOne({
          _id: postID,
          },
          { $inc: { 'downvotes': 1 }
          },
          (err, data) => {
            if (err) return res.status(400).json({message: 'err', error: err})
            if (!data) return res.status(400).json({message: 'There was no post with that ID'});
            if (data) console.log(data);
          }
        )

        Post.updateOne({
          _id: postID,
          },
          { $push: { 'downvoters': userEmail }
          },
          (err, data) => {
            if (err) return res.status(400).json({message: 'err', error: err})
            if (!data) return res.status(400).json({message: 'There was no post with that ID'});
            if (data) console.log(data);
          }
        )

        return res.status(200).json({message: 'downvoted'});
      }
    })

    }
  )

}

exports.upVoteComment = (req, res) => {
  console.log('Upvote API...')
}

exports.downVoteComment = (req, res) => {
  console.log('Downvote API...')
}

exports.followPost = (req, res) => {
  console.log('Attemping to follow post from API')

  if (!req.body._id || !req.body.email) {
    return res.status(400).json({message: 'Call needs a Post _id and an email to identify user'});
  }

  // Get this Post's ID
  let id = req.body._id;
  let email = req.body.email;

  Post.findByIdAndUpdate(
    id,
    { $push: { followers: email } },
    (err, post) => {

    if (err) return res.status(400).json(err);
    console.log('Adding follower ...');

    // Add this Posts's ID to this User's followedPost property
    User.findOneAndUpdate(
      email,
      { $push: { followedPost: { postID: id} } },
      (err, user) => {

      if (err) return res.status(400).json(err);
      console.log('Updating Users Followed Posts');
      console.log(user.followedPost);
      res.status(200).json(user);
    })
  })
}

exports.unFollowPost = (req, res) => {

  if (!req.body._id || !req.body.email) {
    return res.status(400).json({message: 'Call needs a Post _id and an email to identify user'});
  }

  // Get this Post's ID
  let id = req.body._id;
  let email = req.body.email;

  Post.findByIdAndUpdate(
    id,
    { $pull: { followers: email } }, (err, post) => {

    if (err) return res.status(400).json(err);

    // Delete Post from User's followedPost property
    User.findOneAndUpdate(
      { email },
      { $pull: { followedPost: { postID: id } } },
       (err, user) => {

      if (err) return res.status(400).json(err);
      res.status(200).json(user);
    })
  })
}

exports.getFollowedPosts = (req, res) => {
  console.log(req.body)
  let userId = req.body._id;

  User.findById(
    userId,
    (err, user) => {

    if (err) return res.status(400).json({ message: 'Error finding User'});
    if (!user) return res.status(400).json({ message: 'There are no Users with that ID'});

    this.followedPost = Object.values(user.followedPost);
    let finalFollowedPost = []
    for (let i = 0; i < this.followedPost.length; i++) {
      finalFollowedPost.push(this.followedPost[i].postID)
    }

    console.log(finalFollowedPost)

    Post.find({
      _id : { $in: finalFollowedPost}},
      (err, posts) => {

        if (err) return res.status(400).json(err);
        if (!posts) return res.status(400).json({ message: 'There are no Posts with those IDs'});

        return res.status(200).send(posts);

      }
    )
  })
}

exports.comment = (req, res) => {

  console.log(req.body);
  let postID = req.body.postID;
  let userEmail = req.body.userEmail;
  let userFullName = req.body.userFullName;
  let comment = req.body.comment;
  let date = req.body.date;

  // if (!postID || !userEmail || !userFullName ||  !comment || !date  ) {
  //   console.log('figure it out');
  //   return res.status(400).json({message: 'Call needs a Post _id, a comment, and an email to identify user'});
  // }

  // get post ID
  let commentDetails = {
    date,
    userEmail,
    comment,
    userFullName,
    userEmail
  }
  let newComment = Comment(commentDetails);

  Post.findByIdAndUpdate(
    postID,
    { $push:
      { comments: newComment  } },
      (err, comment) => {

    if ( err ) return res.status(400).send(err);
    if ( !comment ) return res.status(400).json({ message: 'there were no posts with this ID' });

    // insert comment inside Post
    return res.status(200).json(comment);
  })
}

exports.deleteComment = (req, res) => {

  if (!req.body._id || !req.body.cid) {
    return res.status(400).json({message: 'Call needs a Post _id and a comments _id , cid'});
  }

  // get post ID
  let id = req.body._id;
  let cid = req.body.cid;

  Post.findByIdAndUpdate( id, { $pull: { comments: { _id: cid } } }  ,(err, post) => {

    if ( err ) return res.status(400).send(err);
    if ( !post ) return res.status(400).json({ message: 'there were no posts with this ID' });

    return res.status(200).json(post);
  })
}

exports.reportComment = (req, res) => {

  if ( !req.body.commentID || !req.body.comment || !req.body.postID || !req.body.post || !req.body.userEmail || !req.body.userFullname || !req.body.reportedUserEmail|| !req.body.reportedUserName ) {
    return res.status(400).json({message: 'Please enter a Comment, Comment ID, Post, Post ID, User name and email of user reporting, and the name and email of user being reported'})
  }

  // Add Current Date to Post
  req.body.date = Date.now()

  let reportedComment = ReportedComment(req.body);
  reportedComment.save( (err, comment ) => {

    if ( err ) return res.status(400).json({message: 'There was an error saving reported comment to database', error: err})

    return res.status(200).json(comment);
  });
}

exports.likeComment = (req, res) => {
  // comment ID
  if ( !req.body.postID || !req.body.commentID) return res.status(400).json({message: 'There is no comment ID or Post ID in request'})

  let postID = req.body.postID;
  let commentID = req.body.commentID;

  Post.updateOne(
    {
        _id: postID,
        'comments._id': commentID
    },
    { $inc: { 'comments.$.likes': 1 } },
     (err, post) => {

       if (err) return res.status(400).json(err)
       if (!post) return res.status(400).json({message: 'There were no posts with that'})
       res.status(200).json({ message: 'liked comment', post});
  })
}

exports.unLikeComment = (req, res) => {
  // comment ID
  if ( !req.body.postID || !req.body.commentID) return res.status(400).json({message: 'There is no comment ID or Post ID in request'})

  let postID = req.body.postID;
  let commentID = req.body.commentID;

  Post.updateOne(
    {
        _id: postID,
        'comments._id': commentID
    },
    { $inc: { 'comments.$.likes': -1 } },
     (err, post) => {

       if (err) return res.status(400).json(err)
       if (!post) return res.status(400).json({message: 'There were no posts with that'})
  res.status(200).json({ message: 'unliked comment', post});
  })
}
