const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  date : {
    type: Date
  },
  userFullName : {
    type: String
  },
  userEmail : {
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

module.exports = Comment = mongoose.model('Comment', CommentSchema);