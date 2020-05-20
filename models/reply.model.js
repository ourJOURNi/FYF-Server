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
  userProfilePicture : {
    type: String
  },
  commentUserEmail : {
    type: String
  },
  commentUserFullName : {
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

module.exports = Reply = mongoose.model('Reply', RepliesSchema);