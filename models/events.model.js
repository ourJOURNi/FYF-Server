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
    type: String,
  },
  description: {
    type: String,
    maxlength: 500
  },
  photo: {
    type: String
  },
  dateCreated: {
    type: Date
  }
});

module.exports = Event = mongoose.model('Event', EventsSchema);