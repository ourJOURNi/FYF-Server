const mongoose = require('mongoose');

let MentorSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 80
  },
  email: {
    type: String,
    maxlength: 80
  },
  address: {
    type: String,
    maxlength: 80
  },
  city: {
    type: String,
    maxlength: 80
  },
  state: {
    type: String,
    maxlength: 80
  },
  zip: {
    type: String,
    maxlength: 80
  },
  phone: {
    type: String,
    maxlength: 80
  },
  description: {
    type: String,
    maxlength: 100
  },
  photo: {
    type: String,
    maxlength: 500
  }
});

module.exports = Job = mongoose.model('Mentor', MentorSchema);