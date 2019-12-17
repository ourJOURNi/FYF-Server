const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    addressOne: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    addressTwo: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    city: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    state: {
      type: String,
      minlength: 2,
      maxlength: 50
    },
    zip: {
      type: String,
      minlength: 5,
      maxlength: 5
    },
    gender: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    dob: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    school: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    grade: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    profilePicture: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    resume: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      minlength: 3,
      maxlength: 50
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 120
    }
  });

// Called before save method on the model
// Turns user entered password into a hash value, with salt
UserSchema.pre('save', function(next){
  // had to use a regular function ^ to get the correct scope of 'this'.
  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      console.log('Password Hashed');
      console.log(hash);
      next();
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  console.log('password: ' + this.password);
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch)  {
    console.log('Passwords Match: ' + isMatch);
    if (err) {
      console.log('There has been an Error');
    } else if (!isMatch) {
      console.log('Passwords do NOT match');
    } else {
      console.log('Passwords match');
    }
    // console.log('entered password: ' + candidatePassword);
    // if (err) return cb(err);
    // cb(null, isMatch);
  })
}


//custom method to generate authToken
UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
  return token;
}

//function to validate user
// function validateUser(user) {
//   const schema = {
//     name: Joi.string().min(3).max(50).required(),
//     email: Joi.string().min(5).max(255).required().email(),
//     password: Joi.string().min(3).max(255).required()
//   };

//   return Joi.validate(user, schema);
// }

module.exports = User = mongoose.model('User', UserSchema);
// exports.validate = validateUser;