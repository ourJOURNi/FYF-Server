const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const imageSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  desc: String,
  created: { type: Date, default: Date.now }
});

let JobSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 80
  },
  companyName: {
    type: String,
    maxlength: 80
  },
  companyEmail: {
    type: String,
    maxlength: 80
  },
  summary: {
    type: String,
    maxlength: 100
  },
  fullJobDescription: {
    type: String,
    maxlength: 500
  },
  rateOfPay: {
    type: Number
  },
  dateCreated: {
    type: Date
  }
});

// const resumeSchema = new mongoose.Schema({

// });


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
    phone: {
      type: String,
      minlength: 10,
      maxlength: 10
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
    profilePicture: [imageSchema],
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
      minlength: 6
    },
    favoriteJobs: [JobSchema],

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
      this.password = user.password;
      console.log('Password Hashed');
      console.log(user.password);
      next();
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    // console.log('Password: ' + candidatePassword);
    // console.log('Hashed Password: ' + this.password);
    // console.log('Passwords Match: ' + isMatch);
    if (err) return cb(err);
    cb(null, isMatch);
  })
}


//custom method to generate authToken
UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
  return token;
}

module.exports = User = mongoose.model('User', UserSchema);
// exports.validate = validateUser;