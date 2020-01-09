const Post = require('../models/post.model');
const User = require('../models/user.model');

exports.getPosts = (req, res) => {

  Post.find( (err, posts) => {
    if (err) return res.status(400).send('Error finding Posts');
    console.log('Getting all Posts');
    return res.status(200).json(posts);
  })
}

exports.addTextPost = (req, res) => {

  if (!req.body.creator || !req.body.date || !req.body.followers || !req.body.comments || !req.body.post) {
    console.log('Please enter a creator, date, followers, comments, and post');
    return res.status(200).json({message: 'Please enter a post creator, date, followers, comments, and post'});
  }

  let newPost = Post(req.body);

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

  let newPost = Post(req.body);

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

  let newPost = Post(req.body);

  newPost.save( (err, post) => {
    if (err) {
      return res.status(400).json({message: 'There was an error saving the post to the database: \n\n' + err});
    }


    console.log('Added Photo Post: ' + post);
    return res.status(200).json(post);
  })
}

exports.followPost = (req, res) => {

  // Get this Post's ID
  let id = req.body._id;
  let email = req.body.email;

  Post.findById(id, (err, post) => {

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
  console.log('Commenting on this post');
  res.status(200).json({message: 'Commenting on this post'});
}

exports.reportPost = (req, res) => {
  console.log('Reporting a post');
  res.status(200).json({message: 'Reporting a post'});
}

exports.likeComment = (req, res) => {
  console.log('Liking a comment');
  res.status(200).json({message: 'Liking a comment'});
}

exports.unLikeComment = (req, res) => {
  console.log('Unliking a comment');
  res.status(200).json({message: 'Unliking a comment'});
}
