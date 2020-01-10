const Post = require('../models/post.model');
const PostQueue = require('../models/postqueue.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const ReportedComment = require('../models/reported-comment');
const mongoose          = require("mongoose");


exports.getPosts = (req, res) => {

  Post.find( (err, posts) => {

    if (err) return res.status(400).json({ message: 'Error finding Posts'});
    if (!posts) return res.status(400).json({ message: 'There are no posts with that ID'});
    console.log('Getting all Posts');
    return res.status(200).json(posts);
  })
}

// Adding a Post involves being added to the PostQueue first
// Admin has access to PostQueue for verification
// Admin sends verified posts to Post collection. 
exports.addTextPost = (req, res) => {

  if (!req.body.creator || !req.body.date || !req.body.followers || !req.body.comments || !req.body.post) {
    console.log('Please enter a creator, date, followers, comments, and post');
    return res.status(200).json({message: 'Please enter a post creator, date, followers, comments, and post'});
  }

  // Add Current Date to Post
  req.body.date = Date.now()

  let newPost = PostQueue(req.body);

  newPost.save( (err, post) => {
    if (err) {
      return res.status(400).json({message: 'There was an error saving the post to the database: \n\n' + err});
    }


    console.log('Added Text Post: ' + post);
    return res.status(200).json(post);
  })
}

exports.addVideoPosts = (req, res) => {

  if (!req.body.creator || !req.body.date || !req.body.followers || !req.body.comments || !req.body.post) {
    console.log('Please enter a creator, date, followers, comments, and post');
    return res.status(200).json({message: 'Please enter a post creator, date, followers, comments, and post'});
  }

  // Add Current Date to Post
  req.body.date = Date.now()

  let newPost = PostQueue(req.body);

  newPost.save( (err, post) => {
    if (err) {
      return res.status(400).json({message: 'There was an error saving the pody to the database: \n\n' + err});
    }


    console.log('Added Video Post: ' + post);
    return res.status(200).json(post);
  })
}

exports.addPhotoPosts = (req, res) => {

  if (!req.body.creator || !req.body.date || !req.body.followers || !req.body.comments || !req.body.post) {
    console.log('Please enter a creator, date, followers, comments, and post');
    return res.status(200).json({message: 'Please enter a post creator, date, followers, comments, and post'});
  }

  // Add Current Date to Post
  req.body.date = Date.now()

  let newPost = PostQueue(req.body);

  newPost.save( (err, post) => {
    if (err) {
      return res.status(400).json({message: 'There was an error saving the post to the database: \n\n' + err});
    }


    console.log('Added Photo Post: ' + post);
    return res.status(200).json(post);
  })
}

exports.followPost = (req, res) => {

  if (!req.body._id || !req.body.email) {
    return res.status(400).json({message: 'Call needs a Post _id and an email to identify user'});
  }

  // Get this Post's ID
  let id = mongoose.Types.ObjectId(req.body._id);
  let email = req.body.email;

  Post.findByIdAndUpdate(
    id,
    { $push: { followers: email } },
    (err, post) => {

    if (err) return res.status(400).json(err);

    // Add this Posts's ID to this User's followedPost property
    User.findOneAndUpdate(
      { email },
      { $push: { followedPost: post}},
      (err, user) => {

      if (err) return res.status(400).json(err);
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

  Post.findById(id, (err, post) => {

    if (err) return res.status(400).json(err);

    // Delete Post from User's followedPost property
    User.findOneAndUpdate(
      { email },
      { $pull: { followedPost: { _id: id } } },
       (err, user) => {

      if (err) return res.status(400).json(err);
      res.status(200).json(user);
    })
  })
}

exports.getComments = (req, res) => {
  console.log('Getting all Comments for this post');
  res.status(200).json({message: 'Getting all Comments for this post'});
}


exports.comment = (req, res) => {

  if (!req.body._id || !req.body.email || !req.body.comment ) {
    return res.status(400).json({message: 'Call needs a Post _id, a comment, and an email to identify user'});
  }

  // get post ID
  let id = req.body._id;
  let comment = {
    date: Date.now(),
    user: req.body.email,
    comment: req.body.comment
  }
  let newComment = Comment(comment);

  Post.findByIdAndUpdate( id, { $push: { comments: newComment  } }, (err, post) => {

    if ( err ) return res.status(400).send(err);
    if ( !post ) return res.status(400).json({ message: 'there were no posts with this ID' });

    // insert comment inside Post
    return res.status(200).json(post);
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
