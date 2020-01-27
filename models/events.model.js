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
  addressOne: {
    type: String,
  },
  addressTwo: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },
  date: {
    type: Date,
  },
  dateCreated: {
    type: Date
  },
  description: {
    type: String,
  },
  photo: {
    type: String
  }
});

module.exports = Event = mongoose.model('Event', EventsSchema);