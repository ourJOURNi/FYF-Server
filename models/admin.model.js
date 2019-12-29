const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema(
  {
  username: {
    type: String,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    minlength: 6
  }
  });

// Called before save method on the model
// Turns user entered password into a hash value, with salt
AdminSchema.pre('save', function(next){
  // had to use a regular function ^ to get the correct scope of 'this'.
  var admin = this;
  if (!admin.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(admin.password, salt, (err, hash) => {
      if (err) return next(err);

      admin.password = hash;
      this.password = admin.password;
      console.log('Password Hashed');
      console.log(admin.password);
      next();
    })
  })
})

AdminSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    // console.log('Password: ' + candidatePassword);
    // console.log('Hashed Password: ' + this.password);
    // console.log('Passwords Match: ' + isMatch);
    if (err) return cb(err);
    cb(null, isMatch);
  })
}

module.exports = Admin = mongoose.model('Admin', AdminSchema);
