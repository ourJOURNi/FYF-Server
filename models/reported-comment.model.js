const mongoose = require('mongoose');

const ReportedCommentSchema = new mongoose.Schema({
  date : {
    type: String
  },
  commentID : {
    type: String
  },
  comment : {
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
  }
})

module.exports = ReportedComment = mongoose.model('ReportedComment', ReportedCommentSchema);