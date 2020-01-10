const Post = require('../../models/post.model');
const UnverifiedPost = require('../../models/unverified-post.model');
const PostQueue = require('../../models/postqueue.model');
const User = require('../../models/user.model');
const Comment = require('../../models/comment.model');
const ReportedComment = require('../../models/reported-comment');

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
exports.verifyYes = (req, res) => {

  if (!req.body.creator || !req.body.date || !req.body.followers || !req.body.comments || !req.body.post ) {
    return res.status(400).json({message: "There was either no creator, date, followers, comments, or no post included in request body "});
  }

  let post = Post(req.body);

  post.save( (err, post) => {

    if (err)  {
      return res.status(400).json(err)
    };
    return res.status(200).json({message: 'Post has been verified and added to Post Collection' , post});
  })
}

// Posts go to Unverified Post Collection
exports.verifyNo = (req, res) => {

  if (!req.body.creator || !req.body.date || !req.body.followers || !req.body.comments || !req.body.post ) {
    return res.status(400).json({message: "There was either no creator, date, followers, comments, or no post included in request body "});
  }

  let unverifiedPost = UnverifiedPost(req.body);

  unverifiedPost.save( (err, post) => {

    if (err)  {
      return res.status(400).json(err)
    };
    return res.status(200).json({message: 'Post has not been verified and added to Unverified Post Collection' , post});
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
      console.log(`Followers of post ${id}: \n` + followers);
      return res.status(200).json({message: `Post ID ${id}'s followers: ` ,followers});
    }
  )

}

// Get comments for given Post
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

// Get comments for given Post
exports.getReportedComments = (req, res) => {
  ReportedComment.find(
    ( err, reportedComments ) => {

      if ( err ) return res.status(400).json(err);

      console.log(`Reported Comments: \n` + reportedComments);
      return res.status(200).json({message: `Reported Comments` ,reportedComments});
    }
  )

}



