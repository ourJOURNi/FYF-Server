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
  },
  likes : {
    type: Number,
    default: 0
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
  comments: [CommentSchema],
  post : {
    type: String,
    maxlength: 500
  }
})



module.exports = Post = mongoose.model('Post', PostSchema);