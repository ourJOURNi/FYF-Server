const Post = require('../models/post.model');
const PostQueue = require('../models/postqueue.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const Reply = require('../models/reply.model');
const ReportedComment = require('../models/reported-comment.model');
const ObjectId = require('mongoose').Types.ObjectId;


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
    if (err) return res.status(400).json({message: 'There was an error finding a user with that email'});
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
            { $push: { 'upvoters': userEmail }
            },
            (err, data) => {
              if (err) return res.status(400).json({message: 'err', error: err})
              if (!data) return res.status(400).json({message: 'There was no post with that ID'});
              if (data) {

                Post.findOneAndUpdate({
                  _id: postID,
                  },
                  { $inc: { 'upvotes': 1 }
                  },
                  { new: true },
                  (err, data) => {

                    let upvotes = data['upvotes'];

                    if (err) return res.status(400).json({message: 'err', error: err})
                    if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                    if (data) {

                      Post.find({
                        _id: postID
                      }, (err, data) => {

                        let downvotes;

                        if (err) return res.status(400).json({message: 'err', error: err})
                        if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                        if (data) downvotes = data[0].downvotes

                        return res.status(200).json({
                          upvotes, downvotes
                        })
                      })
                    }
                  }
                )
              };
            }
          )
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
            { $push: { 'upvoters': userEmail }
            },
            (err, data) => {
              if (err) return res.status(400).json({message: 'err', error: err})
              if (!data) return res.status(400).json({message: 'There was no post with that ID'});
              if (data) console.log(data);
            }
          )

          Post.findOneAndUpdate({
            _id: postID,
            },
            { $inc: { 'upvotes': 1 }},
            { new: true },
            (err, data) => {

              if (err) return res.status(400).json({message: 'err', error: err})
              if (!data) return res.status(400).json({message: 'There was no post with that ID'});
              if (data) {

                let upvotes;
                let downvotes;

                upvotes = data['upvotes']

                Post.findOneAndUpdate({
                  _id: postID,
                  },
                  { $inc: { 'downvotes': -1 }
                  },
                  { new: true },
                  (err, data) => {
                    if (err) return res.status(400).json({message: 'err', error: err})
                    if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                    if (data) downvotes = (data['downvotes'])

                    return res.status(200).json({
                      upvotes, downvotes
                    })
                  }
                )
              };
            }
          )

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

        let downvotes;

        // inc 1 to DOWNVOTES
        // Add UserEmail to DOWNVOTERS

        Post.updateOne({
          _id: postID,
          },
          { $push: { 'downvoters': userEmail }
          },
          (err, data) => {
            if (err) return res.status(400).json({message: 'err', error: err})
            if (!data) return res.status(400).json({message: 'There was no post with that ID'});
            if (data){

              Post.findOneAndUpdate({
                _id: postID,
                },
                { $inc: { 'downvotes': 1 }
                },
                { new: true },
                (err, data) => {

                  let downvotes = data['downvotes'];

                  if (err) return res.status(400).json({message: 'err', error: err})
                  if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                  if (data) {

                    Post.find({
                      _id: postID
                    }, (err, data) => {

                      let upvotes;
                      let downvotes;

                      if (err) return res.status(400).json({message: 'err', error: err})
                      if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                      if (data) upvotes = data[0].upvotes

                      return res.status(200).json({
                        upvotes, downvotes
                      })
                    })
                  }
                }
              )
            }
          })
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
          { $push: { 'downvoters': userEmail }
          },
          (err, data) => {
            if (err) return res.status(400).json({message: 'err', error: err})
            if (!data) return res.status(400).json({message: 'There was no post with that ID'});
            if (data) console.log(data);
          }
        )

        Post.findOneAndUpdate({
          _id: postID,
          },
          { $inc: { 'downvotes': 1 }},
          { new: true },
          (err, data) => {
            if (err) return res.status(400).json({message: 'err', error: err})
            if (!data) return res.status(400).json({message: 'There was no post with that ID'});
            if (data) {

            let upvotes;
            let downvotes;

            downvotes = data['downvotes']

            Post.findOneAndUpdate({
              _id: postID,
              },
              { $inc: { 'upvotes': -1 }
              },
              { new: true },
              (err, data) => {
                if (err) return res.status(400).json({message: 'err', error: err})
                if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                if (data) upvotes = data['upvotes']

                return res.status(200).json({
                  upvotes, downvotes
                })
              }
            )
          }
        }
        )
      }
    })
    }
  )

}

exports.upVoteComment = (req, res) => {
  console.log('Upvote Comments API...');

   // See if Request Body has Post ID and UserEmail
  if ( !req.body.postID || !req.body.commentID || !req.body.userEmail) return res.status(400).json({message: 'There is no post ID, userEmail, or CommentID in request'})

  let postID = req.body.postID;
  let userEmail = req.body.userEmail;
  let commentID = req.body.commentID;


  // If User has not upvoted already continue
  Post.findOne({
    _id: postID, 'comments._id': commentID},
    {'comments.$.upvoters': userEmail},
    (err, data) => {
      if (err) return res.status(400).json({message: 'There was an error find a user with that email'});

      // Check if user has already Upvoted
      if (data.comments[0].upvoters.includes(userEmail)) {
        return res.status(400).json({message: 'User has already upvoted'})
      }

       // If User has not upvoted already continue
      if (!data) {
        console.log(`User with ${userEmail} has never upvoted this post`);
      }

      // Check to see if user has downvoted
      console.log('Checking to see if this user has already downvoted this comment...');

      Post.findOne({
        _id: postID, 'comments._id': commentID},
        {'comments.$.downvoters': userEmail},
        (err, data) => {
          if (err) return res.status(400).json(err);

          if (!data.comments[0].downvoters.includes(userEmail)) {
            // inc 1 to UPVOTES
            // Add UserEmail to UPVOTERS

            Post.updateOne({
              _id: postID, 'comments._id': commentID
              },
              { $push: { 'comments.$.upvoters': userEmail }
              },
              { new: true },
              (err, data) => {
                if (err) return res.status(400).json({message: 'err', error: err})
                if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                if (data) {

                  Post.findOneAndUpdate({
                    _id: postID, 'comments._id': commentID
                    },
                    { $inc: { 'comments.$.upvotes': 1 }
                    },
                    { new: true },
                    (err, data) => {

                      var downvotes;
                      var upvotes;

                      data.comments.find(comment => {
                        if (comment._id == commentID) {
                          console.log('match')

                          console.log(comment)

                          downvotes = comment.downvotes;
                          upvotes = comment.upvotes;

                       }
                      })

                      if (err) return res.status(400).json({message: 'err', error: err})
                      if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                      if (data) {
                        return res.status(200).json({
                        upvotes, downvotes
                      })
                    }
                    })
                };
              }
            )

          }
          if (data.comments[0].downvoters.includes(userEmail)) {
              // inc -1 from DOWNVOTES
              // pull email from DOWNVOTERS
              // inc 1 to UPVOTES
              // Add UserEmail to UPVOTERS

              Post.updateOne({
                _id: postID, 'comments._id': commentID
                },
                { $pull: { 'comments.$.downvoters': userEmail }
                },
                { new: true },
                (err, data) => {
                  if (err) return res.status(400).json({message: 'err', error: err})
                  if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                  if (data) console.log(data);
                }
              )

              Post.updateOne({
                _id: postID, 'comments._id': commentID
                },
                { $push: { 'comments.$.upvoters': userEmail }
                },{ new: true },
                (err, data) => {
                  if (err) return res.status(400).json({message: 'err', error: err})
                  if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                  if (data) console.log(data);
                }
              )

              Post.findOneAndUpdate({
                _id: postID, 'comments._id': commentID
                },
                { $inc: { 'comments.$.upvotes': 1 }},
                { new: true },
                (err, data) => {

                  if (err) return res.status(400).json({message: 'err', error: err})
                  if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                  if (data) {

                    Post.findOneAndUpdate({
                      _id: postID, 'comments._id': commentID
                      },
                      { $inc: { 'comments.$.downvotes': -1 }
                      },
                      { new: true },
                      (err, data) => {

                        let downvotes;
                        let upvotes;

                        data.comments.find(comment => {
                          if (comment._id == commentID) {
                            console.log('match')

                            console.log(comment)

                            downvotes = comment.downvotes;
                            upvotes = comment.upvotes;

                          }
                        })

                        if (err) return res.status(400).json({message: 'err', error: err})
                        if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                        if (data) {
                          return res.status(200).json({
                          upvotes, downvotes
                        })
                      }

                      }
                    )
                  };
                }
              )
              }
            })
  })
}


exports.downVoteComment = async (req, res) => {
  console.log('Downvote Comments API...');

   // See if Request Body has Post ID and UserEmail
  if ( !req.body.postID || !req.body.commentID || !req.body.userEmail) return res.status(400).json({message: 'There is no post ID, userEmail, or CommentID in request'})

  let postID = req.body.postID;
  let userEmail = req.body.userEmail;
  let commentID = req.body.commentID;


  // If User has not downvoted already continue
  Post.findOne({
    _id: postID, 'comments._id': commentID},
    {'comments.$.downvoters': userEmail},
    (err, data) => {
      if (err) return res.status(400).json({message: 'There was an error find a user with that email'});

      // Check if user has already Downvoted
      if (data.comments[0].downvoters.includes(userEmail)) {
        return res.status(400).json({message: 'User has already downvoted'})
      }

       // If User has not downvoted already continue
      if (!data) {
        console.log(`User with ${userEmail} has never downvoted this post`);
      }

      // Check to see if user has upvoted
      console.log('Checking to see if this user has already downvoted this comment...');

      Post.findOne({
        _id: postID, 'comments._id': commentID},
        {'comments.$.upvoters': userEmail},
        (err, data) => {
          if (err) return res.status(400).json(err);

          if (!data.comments[0].upvoters.includes(userEmail)) {
            // inc 1 to DOWNVOTES
            // Add UserEmail to DOWNVOTERS

            Post.updateOne({
              _id: postID, 'comments._id': commentID
              },
              { $push: { 'comments.$.downvoters': userEmail }
              },
              { new: true },
              (err, data) => {

                if (err) return res.status(400).json({message: 'err', error: err})
                if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                if (data) {

                  Post.findOneAndUpdate({
                    _id: postID, 'comments._id': commentID
                    },
                    { $inc: { 'comments.$.downvotes': 1 }
                    },
                    { new: true },
                    (err, data) => {


                      let downvotes;
                      let upvotes;

                      data.comments.find(comment => {
                        if (comment._id == commentID) {
                          console.log('match')

                          console.log(comment)

                          downvotes = comment.downvotes;
                          upvotes = comment.upvotes;

                        }
                      })

                      if (err) return res.status(400).json({message: 'err', error: err})
                      if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                      if (data) {
                        return res.status(200).json({
                        upvotes, downvotes
                      })
                    }
                    }
                  )
                };
              }
            )

          }
          if (data.comments[0].upvoters.includes(userEmail)) {
              // inc -1 from UPVOTES
              // pull email from UPVOTERS
              // inc 1 to DOWNVOTES
              // Add UserEmail to DOWNVOTERS

              Post.updateOne({
                _id: postID, 'comments._id': commentID
                },
                { $pull: { 'comments.$.upvoters': userEmail }
                },
                { new: true },
                (err, data) => {
                  if (err) return res.status(400).json({message: 'err', error: err})
                  if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                  if (data) console.log(data);
                }
              )

              Post.updateOne({
                _id: postID, 'comments._id': commentID
                },
                { $push: { 'comments.$.downvoters': userEmail }
                },
                { new: true },
                (err, data) => {
                  if (err) return res.status(400).json({message: 'err', error: err})
                  if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                  if (data) console.log(data);
                }
              )

              Post.findOneAndUpdate({
                _id: postID, 'comments._id': commentID
                },
                { $inc: { 'comments.$.downvotes': 1 }},
                { new: true },
                (err, data) => {

                  if (err) return res.status(400).json({message: 'err', error: err})
                  if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                  if (data) {

                    Post.findOneAndUpdate({
                      _id: postID, 'comments._id': commentID
                      },
                      { $inc: { 'comments.$.upvotes': -1 }
                      },
                      { new: true },
                      (err, data) => {
                        
                        let comment;
                        let downvotes;
                        let upvotes;



                        data.comments.find(comment => {
                          if (comment._id == commentID) {
                            console.log('match')

                            console.log(comment)

                            downvotes = comment.downvotes;
                            upvotes = comment.upvotes;


                          }
                        })

                        if (err) return res.status(400).json({message: 'err', error: err})
                        if (!data) return res.status(400).json({message: 'There was no post with that ID'});
                        if (data) {

                          return res.status(200).json({
                          upvotes, downvotes
                        })
                      }
                      }
                    )
                  };
                }
              )
              }
            })
  })

}

exports.followPost = (req, res) => {

  // Get this Post's ID
  let id = req.body._id;
  let email = req.body.email;

  console.log(req.body)

  if (!req.body._id || !req.body.email) {
    return res.status(400).json({message: 'Call needs a Post _id and an email to identify user'});
  }

  Post.findByIdAndUpdate(
    id,
    { $push: { followers: email } },
    (err, post) => {

    if (err) return res.status(400).json(err);
    console.log('Adding follower ...');

    // Add this Posts's ID to this User's followedPost property
    User.findOneAndUpdate(
      email,
      { $push: { followedPost: post } },
      (err, user) => {

      if (err) return res.status(400).json(err);
      console.log('Updating Users Followed Posts');
      console.log(user.followedPost);
      return res.status(200).json(user.followedPost);
    })
  })
}

exports.unFollowPost = (req, res) => {

  if (!req.body._id || !req.body.email) {
    return res.status(400).json({message: 'Call needs a Post _id and an email to identify user'});
  }

  console.log('Unfollow request: ', req.body);

  // Get this Post's ID
  let id = req.body._id;
  let email = req.body.email;

  Post.findByIdAndUpdate(
    id,
    { $pull: { followers: email } },
    (err, post) => {

    if (err) return res.status(400).json(err);
    if (!post) return res.status(400).json({ message: 'There were no posts with this ID' });
    console.log('Removing follower ...');

    // Delete Post from User's followedPost property
    User.findOneAndUpdate(
      { email : email },
      { $pull: { followedPost: { _id: ObjectId(id) } } },
      { new : true },
      (err, user) => {

      if (err) return res.status(400).json(err);
      console.log('New User\'s followed posts: ', user.followedPost);
      return res.status(200).json(user.followedPost);
    })
  })
}

exports.getFollowedPosts = (req, res) => {
  let userId = req.body._id;

  User.findById(
    userId,
    (err, user) => {

    if (err ) return res.status(400).json({ message: 'Error finding User'});
    if (!user ) return res.status(400).json({ message: 'There are no Users with that ID'});
    if ( user ) {
      console.log(user.followedPost)
      return res.status(200).json(user.followedPost)
    }
  })
}

exports.editPost = (req, res) => {
  console.log(req.body)

  postID = req.body.postID;
  newPost = req.body.newPost;


  if( !postID || !newPost ) {
    return res.status(400).json({
      message: 'There was no postID, or newPost',
      newPost});
  }

  Post.findOneAndUpdate(
    { _id: postID },
    { $set: {'post': newPost }},
    { new: true },
    (err, data ) => {

      if(err) return res.status(400).json(err);
      if(!data) return res.status(400).json({message: 'There was no post with that ID'});
      if (data) {
        console.log(data);
        return res.status(200).json({message: 'post edit sucessful',post: data});
      }

    })
}

exports.deletePost = (req, res) => {

  let postID = req.body._id;
  console.log(req.body)
  if (!req.body._id) {
    return res.status(400).json({message: 'Call needs a Post ID'});
  }

  Post.findByIdAndDelete(
    {_id: postID},
    (err, post) => {
    if ( err ) return res.status(400).json(err);
    if ( !post ) return res.status(400).json({ message: 'there were no posts with this ID' });
    if (post) {
      console.log(`Deleting Post ${postID}`)

      Post.find((err, remainingPosts) => {
        if(err) return res.status(400).json(err);
        if(!remainingPosts) return res.status(400).json({message: 'There were no Posts returned'});
        if(remainingPosts) {
          console.log(remainingPosts);
          return res.status(200).json(remainingPosts);
        }
      })
    }
  })
}

exports.comment = (req, res) => {

  console.log(req.body);
  let postID = req.body.postID;
  let userEmail = req.body.userEmail;
  let userFullName = req.body.userFullName;
  let comment = req.body.comment;
  let date = req.body.date;

  if (!postID || !userEmail || !userFullName ||  !comment || !date  ) {
    console.log('figure it out');
    return res.status(400).json({message: 'Call needs a Post _id, a comment, and an email to identify user'});
  }

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
      { new: true},
      (err, comment) => {

    if ( err ) return res.status(400).send(err);
    if ( !comment ) return res.status(400).json({ message: 'there were no posts with this ID' });

    // insert comment inside Post
    return res.status(200).json(comment);
  })
}

exports.deleteComment = (req, res) => {

  if (!req.body._id || !req.body._cid) {
    return res.status(400).json({message: 'Call needs a Post _id and a comments _id , cid'});
  }

  // get post ID
  let id = req.body._id;
  let cid = req.body._cid;

  console.log(id)
  console.log(cid)

  Post.findByIdAndUpdate(
    {_id: id},
    { $pull: { 'comments': { '_id': cid }  } },
    { new: true },
    (err, post) => {

    if ( err ) return res.status(400).json(err);
    if ( !post ) return res.status(400).json({ message: 'There were no posts with this ID' });
    if (post) {
      console.log(`Deleting comment ${cid} on post ${id}`)
      return res.status(200).json(
    post);
    }
  })
}

exports.reportComment = (req, res) => {
  console.log(req.body)

  // if ( !req.body.commentID || !req.body.commentContents || !req.body.postID || !req.body.post || !req.body.userEmail || !req.body.userFullname || !req.body.reportedUserEmail || !req.body.reportedUserName || !req.body.reportReason || req.body.commentDate  ) {
  //   return res.status(400).json({message: 'Please enter a Comment, Comment ID, Post, Post ID, User name and email of user reporting, and the name and email of user being reported'})
  // }

  // Add Current Date to Post

  let reportedComment = ReportedComment(req.body);
  reportedComment.save( (err, comment ) => {

    if ( err ) return res.status(400).json(err)
    if ( !comment ) return res.status(400).json({message: 'There were no comments to save'})
    if ( comment ) {
      return res.status(200).json({message: 'comment report made!'});
    }
  });
}

exports.replyComment = (req, res) => {

  // Check to see if request has all the correct data
  // if (
  //     !req.body.commentID ||
  //     !req.body.postID ||
  //     !req.body.reply ||
  //     !req.body.commentUserEmail ||
  //     !req.body.commentUserFullName ||
  //     !req.body.userEmail ||
  //     !req.body.userFullName ||
  //     !req.body.userProfilePicture
  //     ) {

  //     // Dont forgot to check 
  //     return res.status(400).json({message: 'Please enter a Comment, Comment ID, Post, Post ID, User name and email of user reporting, and the name and email of user being reported'})
  // }

  let commentID = req.body.commentID;
  let postID = req.body.postID;
  let reply = req.body.reply;
  let userEmail = req.body.userEmail;
  let userFullName = req.body.userFullName;
  let userProfilePicture = req.body.userProfilePicture;
  let date = Date.now();

  // Find Post
  Post.findById(
    postID,
    (err, post) => {
      if(err) {
        return res.status(200).json({
          message: 'There was a an error finding the post id',
        err})
      }
      if(!post) {
        return res.status(200).json({
          message: 'There was no post with that id'})
      }
      if(post) {
        // Find Comment

        let comments = post.comments;

        let replyDetails = {
          date,
          reply,
          userFullName,
          userProfilePicture,
          userEmail
        }

        let newReply = Reply(replyDetails);

        // console.log('This Posts ID: ' + newReply);
        // postID,
        // { $push:
        //   { comments: newComment  } },

        // Find a Comment _id that matches the commentID of the incoming request
        commentSearch(commentID, comments);

        function commentSearch(commentID, commentsArray){
          for (let i=0; i < commentsArray.length; i++) {
                if (commentsArray[i]._id == commentID) {
                  console.log('Attempting to Add Reply to Comment..');

                  Post.findOneAndUpdate(
                    { _id: postID, 'comments._id': commentID },
                    { $push: {'comments.$.replies': newReply }},
                    { new: true },
                    (err, post) => {

                     if ( err ) return res.status(400).send(err);
                     if ( !post ) return res.status(400).json({ message: 'there were no posts with this ID' });
                     if (post) {
                        console.log(post)
                        return res.status(200).json({
                        message: 'Reply has been added',
                        post: postID,
                        comment: commentID,
                        userEmail: post.comments[i].userEmail,
                        comments: post.comments,
                        replies: post.comments[i].replies
                     });
                   }

                  })
                }
          }

        }
      }
    }
  )

}

exports.editCommment = (req, res) => {

  console.log(req.body)

  postID = req.body.postID;
  commentID = req.body.commentID;
  newComment = req.body.newComment;


  if( !postID || !commentID || !newComment ) {
    return res.status(400).json({
      message: 'There was no postID, commentID, or newComment',
      newComment});
  }

  Post.findOneAndUpdate(
    { _id: postID, 'comments._id': commentID },
    { $set: {'comments.$.comment': newComment }},
    { new: true },
    (err, data ) => {
      console.log(data);

      if(err) return res.status(400).json(err);
      if(!data) return res.status(400).json({message: 'There was no post with that ID'});
      if (data) {
        console.log('post:' + data.comments);
        return res.status(200).json({message: 'comment edit sucessful',
      newComment: data.comments});
      }

    }
  )
}
