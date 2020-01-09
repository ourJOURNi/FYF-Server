const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  date : {
    type: String
  },
  user : {
    type: String
  },
  comment : {
    type: String
  }
})

const PostSchema = new mongoose.Schema({
  creator : {
    type: String
  },
  date : {
    type: String
  },
  followers : {
    type: String
  },
  comments: {
    type: String
  },
  post : {
    type: String,
    maxlength: 500
  }
})



module.exports = Post = mongoose.model('Post', PostSchema);