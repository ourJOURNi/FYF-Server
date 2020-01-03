const mongoose = require('mongoose');

let EventsSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 250
  },
  organizer: {
    type: String,
    maxlength: 250
  },
  location: {
    type: String,
  },
  date: {
    type: Date,
  },
  description: {
    type: String,
    maxlength: 500
  },
  photo: {
    type: Number
  },
  dateCreated: {
    type: Date
  }
});

module.exports = Job = mongoose.model('Event', EventsSchema);