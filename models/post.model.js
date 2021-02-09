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
  repliyingToUserEmail : {
    type: String
  },
  repliyingToUserName : {
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
  userProfilePicture : {
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
  title : {
    type: String
  },
  hashtags : {
    type: Array,
    default: []
  },
  creatorEmail : {
    type: String
  },
  creatorProfilePicture : {
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