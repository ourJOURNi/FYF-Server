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
  lunch: {
    type: String,
  },
  interests: {
    type: String,
  },
  questionOne: {
    type: String,
  },
  questionTwo: {
    type: String,
  },
  questionThree: {
    type: String,
  },
  questionFour: {
    type: String,
  },
  questionFive: {
    type: String,
  },
})

module.exports = FairStudent = mongoose.model('FairStudent', FairStudentSchema);