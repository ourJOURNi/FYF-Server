const mongoose = require('mongoose');

FairVolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    maxlength: 100
  }
})

module.exports = FairVolunteer = mongoose.model('FairVolunteer', FairVolunteerSchema);