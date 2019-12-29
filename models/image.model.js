const mongoose = require('mongoose');

  // Actual DB model
const imageSchema = new mongoose.Schema({
    filename: String,
    originalName: String,
    desc: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);