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
    maxlength: 6
  },
  zip: {
    type: String,
    maxlength: 6
  },
  phone: {
    type: String,
    maxlength: 11
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  photo: {
    type: String,
  }
});

module.exports = Mentor = mongoose.model('Mentor', MentorSchema);