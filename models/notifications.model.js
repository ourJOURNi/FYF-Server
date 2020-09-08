const config = require('config');
const mongoose = require('mongoose');

const NotificationsSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    date: {
      type: String,
    },
    instigatingUser: {
      type: String,
    },
    recievingUser: {
      type: String,
    },
  }
)
