const mongoose = require('mongoose');

const ReportedCommentSchema = new mongoose.Schema({
  commentDate : {
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
  reportedUserName : {
    type: String
  },
  reportedReason : {
    type: String
  }
})

module.exports = ReportedComment = mongoose.model('ReportedComment', ReportedCommentSchema);