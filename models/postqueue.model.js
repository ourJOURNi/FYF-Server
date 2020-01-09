const mongoose = require('mongoose');

const PostQueueSchema = new mongoose.Schema({
  creator : {
    type: String
  },
  date : {
    type: Date
  },
  post : {
    type: String,
    maxlength: 500
  }
})



module.exports = PostQueue = mongoose.model('PostQueue', PostQueueSchema);