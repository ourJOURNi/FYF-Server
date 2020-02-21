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
  description: {
    type: String,
  },
  students: {
    type: [],
    default: []
  },
  partners: {
    type: Array,
    default: []
  },
  chaperones: {
    type: Array,
    default: []
  },
  agenda: {
    type: Array,
    default: []
  }
})


module.exports = Fair = mongoose.model('Fair', FairSchema);