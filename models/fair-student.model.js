const mongoose = require('mongoose');

FairStudentSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    maxlength: 100
  },
  school: {
    type: String,
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
  },
  grade: {
    type: String,
  },
  lunch: {
    type: String,
  },
  interests: {
    type: String,
  },
  question1: {
    type: Object,
  },
  question2: {
    type: Object,
  },
  question3: {
    type: Object,
  },
  question4: {
    type: Object,
  },
  question5: {
    type: Object,
  }
})

module.exports = FairStudent = mongoose.model('FairStudent', FairStudentSchema);