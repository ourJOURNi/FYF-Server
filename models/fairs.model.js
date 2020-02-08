const mongoose = require('mongoose');

let StudentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    maxlength: 100
  },
  school: {
    type: String,
    maxlength: 100
  },
  grade: {
    type: String,
    maxlength: 100
  },
  phone: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    maxlength: 100
  },
  gender: {
    type: String,
    maxlength: 100
  },
  lunch: {
    type: String,
    maxlength: 100
  }
})

let ChaperoneSchema = new mongoose.Schema({
  fullName: {
    type: String,
    maxlength: 100
  },
  school: {
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
  lunch: {
    type: String,
  }
})

let PartnerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    maxlength: 100
  },
  phone: {
    type: String,
    maxlength: 100
  },
  organization: {
    type: String,
    maxlength: 100
  },
  logo: {
    type: String,
    maxlength: 100
  },
  lunch: {
    type: String,
    maxlength: 100
  },
  additionalNames: {
    type: String,
    maxlength: 100
  }

})

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
  dateCreated: {
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
    type: [StudentSchema],
    default: []
  },
  partners: {
    type: [PartnerSchema],
    default: []
  },
  chaperones: {
    type: [ChaperoneSchema],
    default: []
  }
})


module.exports = Fair = mongoose.model('Fair', FairSchema);