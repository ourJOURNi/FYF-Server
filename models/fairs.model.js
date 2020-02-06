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
  description: {
    type: Date,
  },
  address: {
    type: Date,
  },
  city: {
    type: Date,
  },
  state: {
    type: Date,
  },
  students: {
    type: StudentSchema,
  },
  partners: {
    type: PartnerSchema,
  },
  chaperones: {
    type: ChaperoneSchema,
  }
})


module.exports = Event = mongoose.model('Event', EventsSchema);