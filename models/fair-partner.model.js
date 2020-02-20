const mongoose = require('mongoose');

FairPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    maxlength: 100
  },
  logo: {
    type: String,
  },
  phone: {
    type: String,
  },
  company: {
    type: String,
  },
  lunch: {
    type: String,
  },
  colleagues: {
    type: String,
  }
})

module.exports = FairPartner = mongoose.model('FairPartner', FairPartnerSchema);