const mongoose = require('mongoose');

let FairSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 100
  },
  date: {
    type: Date,
  },
  time: {
    type: Date,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String
  },
  dateRegistered: {
    type: Date,
  },
  summary: {
    type: String,
    maxlength: 250
  },
  students: {
    type: [],
    default: []
  },
  studentDescription: {
    type: String,
  },
  studentAgenda: {
    type: Array,
    default: []
  },
  studentFAQ: {
    type: Array,
    default: []
  },
  chaperones: {
    type: Array,
    default: []
  },
  chaperoneDescription: {
    type: String,
  },
  chaperoneAgenda: {
    type: Array,
    default: []
  },
  chaperoneFAQ: {
    type: Array,
    default: []
  },
  volunteers: {
    type: Array,
    default: []
  },
  volunteerDescription: {
    type: String,
  },
  volunteerAgenda: {
    type: Array,
    default: []
  },
  volunteerFAQ: {
    type: Array,
    default: []
  },
  partners: {
    type: Array,
    default: []
  },
  partnerDescription: {
    type: String,
  },
  partnerAgenda: {
    type: Array,
    default: []
  },
  partnerFAQ: {
    type: Array,
    default: []
  }
})


module.exports = Fair = mongoose.model('Fair', FairSchema);