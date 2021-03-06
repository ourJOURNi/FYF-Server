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


const PostQueueSchema = new mongoose.Schema({
  title : {
    type: String
  },
  hashtags : {
    type: Array,
    default: []
  },
  creatorName : {
    type: String
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
    // maxlength: 500
  }
})



module.exports = PostQueue = mongoose.model('PostQueue', PostQueueSchema);