const mongoose = require('mongoose');

let JobSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 80
  },
  companyName: {
    type: String,
    maxlength: 80
  },
  companyEmail: {
    type: String,
    maxlength: 80
  },
  summary: {
    type: String,
    maxlength: 100
  },
  fullJobDescription: {
    type: String,
    maxlength: 500
  },
  rateOfPay: {
    type: Number
  },
  dateCreated: {
    type: Date
  }
});

module.exports = Job = mongoose.model('Job', JobSchema);