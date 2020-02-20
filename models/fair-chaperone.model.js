const mongoose = require('mongoose');

FairChaperoneSchema = new mongoose.Schema({
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
  lunch: {
    type: String,
  }
})

module.exports = FairChaperone = mongoose.model('FairChaperone', FairChaperoneSchema);