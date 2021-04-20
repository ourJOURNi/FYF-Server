const mongoose = require('mongoose');

const ReportedCommentSchema = new mongoose.Schema({
  commentDate : {
    type: String
  },
  reportedUID : {
    type: String
  },
  commentID : {
    type: String
  },
  commentContents : {
    type: String
  },
  postID : {
    type: String
  },
  post : {
    type: String
  },
  userEmail : {
    type: String
  },
  userFullname : {
    type: String
  },
  reportedUserEmail : {
    type: String
  },
  reportedUserProfilePicture : {
    type: String
  },
  reportedUserName : {
    type: String
  },
  reportReason : {
    type: String
  }
})

module.exports = ReportedComment = mongoose.model('ReportedComment', ReportedCommentSchema);