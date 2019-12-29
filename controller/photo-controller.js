const Image = require('../models/image.model');
const User = require('../models/user.model');
const multer     = require('multer');

let UPLOAD_PATH = 'uploads'

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, UPLOAD_PATH)
//   },
//   filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//   }
// })

// let upload = multer({ storage: storage })

exports.uploadPhoto = (req, res) => {
  console.log('request: ' + req)
  User.findOneAndUpdate(email = req.email , { profilePicture: newImage}, {returnNewDocument: true}, function( error, result){
     if(error) {
       res.status(400).send("There was an error updating the image");
     }

     if (!result) {
       res.status(400).send('There was no user with that email');
     }

      res.status(200).send('Photo has been updated');
  });


};