const mongoose = require('mongoose');

FairPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 100
  },
  logo: {
    type: String,
  },
  gender: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    maxlength: 100
  },
  phone: {
    type: String,
  },
  organization: {
    type: String,
  },
  description: {
    type: String,
    maxlength: 600
  },
  lunch: {
    type: String,
  },
  colleagues: {
    type: String,
  },
  verified: {
    type: Boolean,
  }
})

module.exports = FairPartner = mongoose.model('FairPartner', FairPartnerSchema);