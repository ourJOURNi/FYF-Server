const Post = require('../../models/post.model');
const DeniedPost = require('../../models/denied-post.model');
const PostQueue = require('../../models/postqueue.model');
const User = require('../../models/user.model');
const Comment = require('../../models/comment.model');
const ReportedComment = require('../../models/reported-comment.model');
const ReportedCommentArchive = require('../../models/reported-comment-archieve.model');


exports.getPosts = (req, res) => {

  Post.find( (err, posts) => {

    if (err) return res.status(400).json({ message: 'Error finding Posts'});
    if (!posts) return res.status(400).json({ message: 'There are no posts with that ID'});
    console.log('Getting all Posts');
    return res.status(200).json(posts);
  })
}

exports.getPostsToBeVerified = (req, res) => {

  PostQueue.find( (err, posts) => {

    if (err) return res.status(400).json({ message: 'Error finding Posts'});
    if (!posts) return res.status(400).json({ message: 'There are no posts with that ID'});
    console.log('Getting all Posts to be Verified');
    return res.status(200).json(posts);
  })
}

// Posts go to Post Collection
exports.verify = (req, res) => {

  let id = req.body._id;

  if ( !id ) {
    return res.status(400).json({message: "There was no id in request body"});
  }

  PostQueue.findByIdAndDelete( {_id: id}, (err, post) => {

    if ( err ) return res.status(400).json(err)
    let postInfo = {
      creatorName: post.creatorName,
      creatorEmail: post.creatorEmail,
      creatorProfilePicture: post.creatorProfilePicture,
      hashtags: post.hashtags,
      post: post.post,
      title: post.title,
      date: post.date
    }

    let verifiedPost = Post(postInfo);

    verifiedPost.save( (err, post) => {

    if (err)  {
      return res.status(400).json(err)
    };

    // add to users own posts propety
    User.updateOne(
      { email: post.creatorEmail },
      { $push: { posts: post}},
      (err, post) => {
        if (err) return res.status(400).json(err)
        console.log(post)
      }
    )

    PostQueue.find((err, posts) => {
      return res.status(200).json(posts);
    })
  })
  })
}

exports.getDenied = (req, res) => {

  DeniedPost.find( (err, posts) => {

    if (err) return res.status(400).json({ message: 'Error finding Posts'});
    if (!posts) return res.status(400).json({ message: 'There are no posts with that ID'});
    console.log('Getting all Posts');
    return res.status(200).json(posts);
  })
}

// Posts go to Unverified Post Collection
exports.deny = (req, res) => {

  let id = req.body._id;

  if ( !id ) {
    return res.status(400).json({message: "There was no id in request body"});
  }

  PostQueue.findByIdAndDelete( {_id: id}, (err, post) => {

    if ( err ) return res.status(400).json(err)
    let postInfo = {
      creatorName: post.creatorName,
      creatorEmail: post.creatorEmail,
      post: post.post,
      title: post.title,
      date: post.date
    }

    let unverifiedPost = DeniedPost(postInfo);

    unverifiedPost.save( (err, post) => {

    if (err)  {
      return res.status(400).json(err)
    };

    PostQueue.find((err, posts) => {
      return res.status(200).json(posts);
    })
  })
  })
}

exports.getFollowers = (req, res) => {

  if ( !req.body._id ) {
    return res.status(400).json({message: 'Request needs a post _id'})
  }

  let id = req.body._id;

  Post.findById(
    id,
    ( err, post ) => {

      if ( err ) return res.status(400).json(err);
      let followers = post.followers;
      followersWithInfo = [];

      for (let i = 0; i < followers.length; i++) {

        User.findOne({email: followers[i]}, (err, follower) => {

          if(err) return res.send(400).json(err);
          if(!followers) return res.send(400).json({message: 'There was no user with that ID'});

        })

        followersWithInfo.push();
      }
      return res.status(200).json({Post_ID: `${id}` , followersWithInfo});
    }
  )

}

exports.getComments = (req, res) => {

  if ( !req.body._id ) {
    return res.status(400).json({message: 'Request needs a post _id'})
  }

  let id = req.body._id;
  Post.findById(
    id,
    ( err, post ) => {

      if ( err ) return res.status(400).json(err);
      let comments = post.comments;
      console.log(`Comments of post ${id}: \n` + comments);
      return res.status(200).json({message: `Post ID ${id}'s comments: ` ,comments});
    }
  )

}

exports.getReportedComments = (req, res) => {

  ReportedComment.find(
    ( err, reportedComments ) => {

      if ( err ) return res.status(400).json(err);

      console.log(`Reported Comments: \n` + reportedComments);
      return res.status(200).json(reportedComments);
    }
  )
}

exports.getReportedArchive = (req, res) => {

  ReportedCommentArchive.find(
    ( err, reportedComments ) => {

      if ( err ) return res.status(400).json(err);
      if ( !reportedComments ) {

        console.log('There were no comments in the reported Archives section. Please check Reported Comments Archive Collection');

        res.status(400).json({message: 'There were no comments in the reported Archives section. Please check Reported Comments Archive Collection'})
      }

      console.log(`Reported Comments Archive: \n` + reportedComments);
      return res.status(200).json({message: `Reported Comments Archive` ,reportedComments});
    }
  )
}

exports.goToReportedArchive = (req, res) => {

  ReportedCommentArchive.find(
    ( err, reportedComments ) => {

      if ( err ) return res.status(400).json(err);
      if ( !reportedComments ) {

        console.log('There were no comments in the reported Archives section. Please check Reported Comments Archive Collection');

        res.status(400).json({message: 'There were no comments in the reported Archives section. Please check Reported Comments Archive Collection'})
      }

      console.log(`Reported Comments Archive: \n` + reportedComments);
      return res.status(200).json({message: `Reported Comments Archive` ,reportedComments});
    }
  )
}

exports.deletePost = (req, res) => {

  Post.findByIdAndDelete( req.params._id, (err) => {
    if (err) return err;
  } );
  console.log(req.params._id + ' Post deleted');
  res.status(200).json(req.params._id + ' Post deleted');
}

exports.deleteComment = (req, res) => {

  Post.updateOne(
    { _id: req.params._id },
    { $pull : { comments: { _id: req.params.commentID} } },
    ( err, post ) => {
      if ( err ) return res.status(400).json(err);

      console.log(`Deleted Comment: \n`);
      return res.status(200).json({message: `Comment Deleted` ,post});
    }
  )
}

exports.deleteReportedComment = (req, res) => {

  Post.updateOne(

    { _id: req.params._id },
    { $pull : { comments: { _id: req.params.commentID} } },
    ( err, post ) => {
      if ( err ) return res.status(400).json(err);
      if ( !post ) return res.status(400).json({message: 'There was no post with that ID in the Posts section'});

      console.log(`Deleted Reported Comment from Post: \n`);
      console.log(post);

      ReportedComment.findOneAndDelete(
        { commentID: req.params.commentID},
        (err, reportedComment) => {

          if ( err ) return res.status(400).json(err);
          if ( !reportedComment ) return res.status(400).json({ message: 'There was no comment with that ID in the Reported Comments Collection'});

          console.log(reportedComment);

          let finalReportedComment = ReportedCommentArchive({
            postID: reportedComment.postID,
            post: reportedComment.post,
            commentID: reportedComment.commentID,
            comment: reportedComment.comment,
            userEmail: reportedComment.userEmail,
            userFullname: reportedComment.userFullname,
            reportedUserEmail: reportedComment.reportedUserEmail,
            reportedUserName: reportedComment.reportedUserName,
          })

          finalReportedComment.save((err, comment) => {

            if (err) return res.status(400).json(err)

            console.log('Reported Comment has been saved to Archives AFTER it was deleted from Reported Comments Collection');

            return res.status(200).json({message: `Deleted Reported Comment from Post, and from Report Comments Collection` ,reportedComment});
          })
        }
      )
    }
  )
}



