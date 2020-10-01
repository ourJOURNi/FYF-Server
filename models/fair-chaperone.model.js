const mongoose = require('mongoose');

FairChaperoneSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 200
  },
  email: {
    type: String,
    maxlength: 100
  },
  gender: {
    type: String,
    maxlength: 100
  },
  school: {
    type: String,
    maxlength: 100
  },
  phone: {
    type: String,
    maxlength: 10
  },
  lunch: {
    type: String,
    maxlength: 200
  }
})

module.exports = FairChaperone = mongoose.model('FairChaperone', FairChaperoneSchema);