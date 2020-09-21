
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

let MessageSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  chatId: {
    type: String,
  },
  date: {
    type: Date
  },
  userFullName: {
    type: String
  },
  userEmail: {
    type: String
  },
  profilePicture: {
    type: String
  }
});

let StudentChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    maxlength: 80
  },
  dateCreated: {
    type: Date
  },
  from: {
    type: String
  },
  messages: {
    type: [MessageSchema]
  },
  requestingUserFullname: {
    type: String
  },
  requestingUserEmail: {
    type: String
  },
  requestingUserPhoto: {
    type: String
  },
  respondingUserFullname: {
    type: String
  },
  respondingUserEmail: {
    type: String
  },
  respondingUserPhoto: {
    type: String
  },
  isUser: {
    type: Boolean,
    default: false
  }
});

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      maxlength: 50
    },
    about: {
      type: String,
      maxlength: 500
    },
    city: {
      type: String,
      maxlength: 50
    },
    state: {
      type: String,
      maxlength: 50
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    school: {
      type: String,
    },
    grade: {
      type: String,
      maxlength: 50
    },
    profilePicture: {
      type: String,
    },
    resume: {
      type: String,
    },
    email: {
      type: String,
      maxlength: 50
    },
    password: {
      type: String,
      minlength: 6
    },
    favoriteJobs: {
      type: Array,
      default: []
    },
    followedPost: {
    type: Array,
    default: []
    },
    posts: {
    type: Array,
    default: []
    },
    eventsGoing: {
    type: Array,
    default: []
    },
    studentChat: {
    type: Array,
    default: [StudentChatSchema]
    },
    mentorChat: {
    type: Array,
    default: []
    },
    notifications: {
    type: Array,
    default: []
    },
})

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