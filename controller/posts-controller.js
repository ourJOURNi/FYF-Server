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

  let upvotes;
  let downvotes;

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

exports.upVoteComment = async (req, res) => {
  console.log('Upvote Comments API...');
  console.log(req.body.postID);
  console.log(req.body.userEmail);
  console.log(req.body.commentID);

   // See if Request Body has Post ID and UserEmail
  if ( !req.body.postID || !req.body.commentID || !req.body.userEmail) return res.status(400).json({message: 'There is no post ID or userEmail in request'})

  let postID = req.body.postID;
  let userEmail = req.body.userEmail;
  let commentID = req.body.commentID;

  await Post.findById(
    postID,
    (err, data) => {

      if (err) return res.status(400).json({message: err});
      if (!data) return res.status(400).json({
        message: `there wasn't any posts with the _id of ${postID}`
      })

      Post.findOne({
        _id: postID,
        'comments.upvoters': userEmail
      },
      (err, data) => {
        // Check if user has already upvoted comment
        console.log('Checking to see if this user has already upvoted this comment...');
        if (err) return res.status(400).json({ message: 'There was an error finding a user with that email' })
        if (data) {
          console.log(data);
          console.log('This user previously upvoted this comment');
          return res.status(200).json({ message: 'This user previously upvoted this comment', alreadyUpvoted: true });
        }

        // If the user hasn't upvoted already, continue
        if (!data) {
          console.log(`User with email ${userEmail} hasn\'t upvoted this post`);

          Post.findOne({
            _id: postID,
            'comments.downvoters': userEmail
          }, (err, data) => {
            // Check if user has previously downvoted comment
            console.log('Checking to see if this user has previously downvoted this comment...');
            if (err) return res.status(400).json({ message: 'There was an error finding a user with that email' });
            if (data) {
              // User downvoted previously
              console.log('This user has previously downvoted this comment');
              Post.updateOne(
                { _id: postID, 'comments._id': commentID },
                { $pull: {'comments.$.downvoters': userEmail }, $inc: { 'comments.$.downvotes': -1 } },
                { new: true },
                (err, data) => {
                  if (err) return res.status(400).json({ message: 'err: An error occurred while trying to remove downvote', error: err});
                  if (!data) return res.status(400).json({ message: 'There was no comment with that ID'});
                  console.log(data);
                }
              )
            }
            
            if (!data) {
              console.log('This user has not previously downvoted this comment');
            }
    
            Post.updateOne(
              { _id: postID, 'comments._id': commentID },
              { $push: { 'comments.$.upvoters': userEmail }, $inc: { 'comments.$.upvotes': 1 } },
              { new: true },
              (err, data) => {
                if (err) return res.status(400).json({ message: 'err: An error occurred while trying to add upvote', error: err });
                if (!data) return res.status(400).json({ message: 'There was no comment with that ID' });

                Post.find({
                  _id: postID,
                  'comments._id': commentID
                }, (err, data) => {
                  let comments = data[0]['comments']
                  let matchedComment;
                  let commentUpvoters;
                  let commentDownvoters;

                  function commentSearch(cID, commentsArray) {
                    for (let i=0; i < commentsArray.length; i++) {
                      if (commentsArray[i]._id == cID) {
                        matchedComment = commentsArray[i];
                        commentUpvoters = commentsArray[i].upvoters;
                        commentDownvoters = commentsArray[i].downvoters;
                      }
                    }
                  }

                  commentSearch(commentID, comments)
                  
                  console.log('Comments: ', comments);
                  console.log(commentUpvoters)


                  let upvotes = commentUpvoters.length;
                  let downvotes = commentDownvoters.length;
                  return res.status(200).json({ upvotes: upvotes, downvotes: downvotes });
                })
              }
            )

          })
        }
      })


      // // Find the comment that matches the commentID
      // let comments = data['comments'];
      // let matchedComment;
      // let commentUpvoters;
      // let commentDownvoters;

      // console.log(`Amount of Comments: ${comments.length}`)
      // // console.log(comments);

      // // Loop through this Post's comments property and find a comment with a matching comment_id
      // commentSearch(commentID, comments);

      // function commentSearch(commentID, commentsArray){
      //   for (let i=0; i < commentsArray.length; i++) {
      //     if (commentsArray[i]._id == commentID) {
      //       matchedComment = commentsArray[i];
      //       commentUpvoters = commentsArray[i].upvoters;
      //       commentDownvoters = commentsArray[i].downvoters;
      //     }
      //   }
      // }

      // console.log('Matched comment: ', matchedComment.comment)
      // console.log(commentUpvoters)
      // console.log(commentDownvoters)

      // // Upvote if user hasn't already done so
      // commentDownvoters.find( downvoters => {
      //   return downvoters === userEmail;
      // })

  })
}

exports.downVoteComment = async (req, res) => {
  console.log('Downvote API...')
  console.log(req.body.postID);
  console.log(req.body.commentID)
  console.log(req.body.userEmail);

  if ( !req.body.postID || !req.body.commentID || !req.body.userEmail) return res.status(400).json({message: 'There is no post ID or userEmail in request'})

  let postID = req.body.postID;
  let commentID = req.body.commentID;
  let userEmail = req.body.userEmail;

  // If User has not downvoted already continue

  await Post.findById(
    postID,
    (err, data) => {

      if (err) return res.status(400).json({ message: err });
      if (!data) return res.status(400).json({ message: `There were no posts with id ${postID}`});

      Post.findOne({
        _id: postID,
        'comments.downvoters': userEmail
      }, (err, data) => {
        // Check if user has already downvoted comment
        console.log("Checking to see if this user has already downvoted this comment...");
        if (err) return res.status(400).json({ message: 'There was an error finding a user with that email' });
        if (data) {
          console.log(data);
          console.log('This user previously downvoted this comment');
          return res.status(200).json({ message: 'This user previously downvoted this comment', alreadyDownvoted: true });
        }

        // If the user hasn't downvoted already, continue
        if (!data) {
          console.log(`User with email ${userEmail} hasn\'t downvoted this comment`);

          Post.findOne({
            _id: postID,
            'comments.upvoters': userEmail},
            (err, data) => {
            // Check if user has previously upvoted comment
            console.log('Checking to see if this user has already upvoted this comment...');
            if (err) return res.status(400).json({ message: 'There was an error finding a user with that email' });
            if (data) {
              // User upvoted previously
              console.log('This user has previously upvoted this comment');
              Post.updateOne(
                { _id: postID, 'comments._id': commentID },
                { $pull: { 'comments.$.upvoters': userEmail }, $inc: { 'comments.$.upvotes': -1 } },
                { new: true },
                (err, data) => {
                  if (err) return res.status(400).json({ message: 'err: An error occurred while trying to remove upvote', error: err });
                  if (!data) return res.status(400).json({ message: 'There was no comment with that ID' });
                  console.log(data);
                }
              )
            }
    
            if (!data) {
              console.log('This user has not previously upvoted this comment');
            }
    
            Post.updateOne(
              { _id: postID, 'comments._id': commentID },
              { $push: { 'comments.$.downvoters': userEmail }, $inc: { 'comments.$.downvotes': 1 } },
              { new: true },
              (err, data) => {
                if (err) return res.status(400).json({ message: 'err: An error occurred while trying to add downvote', error: err });
                if (!data) return res.status(400).json({ message: 'There was no comment with that ID' });

                Post.find({
                  _id: postID,
                  'comments._id': commentID
                }, (err, data) => {
                  let comments = data[0]['comments']
                  let matchedComment;
                  let commentUpvoters;
                  let commentDownvoters;

                  function commentSearch(cID, commentsArray) {
                    for (let i=0; i < commentsArray.length; i++) {
                      if (commentsArray[i]._id == cID) {
                        matchedComment = commentsArray[i];
                        commentUpvoters = commentsArray[i].upvoters;
                        commentDownvoters = commentsArray[i].downvoters;
                      }
                    }
                  }

                  commentSearch(commentID, comments)
                  
                  console.log('Comments: ', comments);
                  console.log(commentUpvoters)


                  let upvotes = commentUpvoters.length;
                  let downvotes = commentDownvoters.length;
                  return res.status(200).json({ upvotes: upvotes, downvotes: downvotes });
                })
              }
            )

          })
        }
      })
    }
  )

  // await Post.findOne({
  //   _id: postID,
  //   'downvoters': userEmail
  // }, (err, data) => {
  //   if (err) return res.status(400).json({message: 'There was an error find a user with that email'});

  //   if (data) {
  //     console.log('This User has already Downvoted')
  //     return res.status(400).json({message: 'This user has already Downvoted'});
  //   }
  //   if (!data) console.log(`User with ${userEmail} has never Downvoted this post`);

  //   // Check to see if user has Upvoted
  //   console.log('Checking to see if this user has already Upvoted this post...');

  //   Comment.findByIdAndUpdate({
  //     commentID,
  //     'upvoters': userEmail
  //   },
  //   (err, data) => {
  //     if (err) return res.status(400).json({message: 'There was an error find a user with that email'});

  //     // User Never Upvoted
  //     if (!data) {
  //       console.log(`This user has not already upvoted`);

  //       let downvotes;

  //       // inc 1 to DOWNVOTES
  //       // Add UserEmail to DOWNVOTERS

  //       Post.updateOne({
  //         _id: postID,
  //         },
  //         { $push: { 'downvoters': userEmail }
  //         },
  //         (err, data) => {
  //           if (err) return res.status(400).json({message: 'err', error: err})
  //           if (!data) return res.status(400).json({message: 'There was no post with that ID'});
  //           if (data){

  //             Post.findOneAndUpdate({
  //               _id: postID,
  //               },
  //               { $inc: { 'downvotes': 1 }
  //               },
  //               { new: true },
  //               (err, data) => {

  //                 let downvotes = data['downvotes'];

  //                 if (err) return res.status(400).json({message: 'err', error: err})
  //                 if (!data) return res.status(400).json({message: 'There was no post with that ID'});
  //                 if (data) {

  //                   Post.find({
  //                     _id: postID
  //                   }, (err, data) => {

  //                     let upvotes;

  //                     if (err) return res.status(400).json({message: 'err', error: err})
  //                     if (!data) return res.status(400).json({message: 'There was no post with that ID'});
  //                     if (data) upvotes = data[0].upvotes

  //                     return res.status(200).json({
  //                       upvotes, downvotes
  //                     })
  //                   })
  //                 }
  //               }
  //             )
  //           }
  //         })
  //     }
  //     // User Upvoted Previously
  //     if (data) {
  //       console.log(`This user has already upvoted`);

  //       // inc -1 from DOWNVOTES
  //       // pull email from DOWNVOTERS
  //       // inc 1 to UPVOTES
  //       // Add UserEmail to UPVOTERS

  //       Post.updateOne({
  //         _id: postID,
  //         },
  //         { $pull: { 'upvoters': userEmail }
  //         },
  //         (err, data) => {
  //           if (err) return res.status(400).json({message: 'err', error: err})
  //           if (!data) return res.status(400).json({message: 'There was no post with that ID'});
  //           if (data) console.log(data);
  //         }
  //       )

  //       Post.updateOne({
  //         _id: postID,
  //         },
  //         { $push: { 'downvoters': userEmail }
  //         },
  //         (err, data) => {
  //           if (err) return res.status(400).json({message: 'err', error: err})
  //           if (!data) return res.status(400).json({message: 'There was no post with that ID'});
  //           if (data) console.log(data);
  //         }
  //       )

  //       Post.findOneAndUpdate({
  //         _id: postID,
  //         },
  //         { $inc: { 'downvotes': 1 }},
  //         { new: true },
  //         (err, data) => {
  //           if (err) return res.status(400).json({message: 'err', error: err})
  //           if (!data) return res.status(400).json({message: 'There was no post with that ID'});
  //           if (data) {

  //           let upvotes;
  //           let downvotes;

  //           downvotes = data['downvotes']

  //           Post.findOneAndUpdate({
  //             _id: postID,
  //             },
  //             { $inc: { 'upvotes': -1 }
  //             },
  //             { new: true },
  //             (err, data) => {
  //               if (err) return res.status(400).json({message: 'err', error: err})
  //               if (!data) return res.status(400).json({message: 'There was no post with that ID'});
  //               if (data) upvotes = data['upvotes']

  //               return res.status(200).json({
  //                 upvotes, downvotes
  //               })
  //             }
  //           )
  //         }
  //       }
  //       )
  //     }
  //   })
  //   }
  // )

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


      // return res.status(200).json(post);
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

  Post.updateOne(
    { _id: postID, 'comments._id': commentID },
    { $set: {'comments.$.comment': newComment }},
    { new: true },
    (err, data ) => {

      if(err) return res.status(400).json(err);
      if(!data) return res.status(400).json({message: 'There was no post with that ID'});
      if (data) {
        console.log(data);
        return res.status(200).json({message: 'comment edit sucessful'});
      }

    }
  )
}
