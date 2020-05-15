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
  upvotes : {
    type: Number,
    default: 0
  },
  downvotes : {
    type: Number,
    default: 0
  },
  upvoters : {
    type: Array,
    default: []
  },
  downvoters : {
    type: Array,
    default: []
  },
  replies : {
    type: Array,
    default: []
  }
})

module.exports = Comment = mongoose.model('Comment', CommentSchema);