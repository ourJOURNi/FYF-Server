const mongoose = require('mongoose');

const RepliesSchema = new mongoose.Schema({
  date : {
    type: Date
  },
  userFullName : {
    type: String
  },
  userEmail : {
    type: String
  },
  reply : {
    type: String
  },
  upvotes : {
    type: Number,
    default: 0
  },
  downvotes : {
    type: Number,
    default: 0
  }
})

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
    default: [RepliesSchema]
  }
})

const PostSchema = new mongoose.Schema({
  creatorName : {
    type: String
  },
  creatorEmail : {
    type: String
  },
  date : {
    type: Date
  },
  followers : {
    type: Array,
    default: []
  },
  comments: {
    type: [CommentSchema],
    default: []
},
  post : {
    type: String,
    maxlength: 500
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
  }
})



module.exports = Post = mongoose.model('Post', PostSchema);