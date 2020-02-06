const Image      = require('../models/image.model');
const User       = require('../models/user.model');
const multer     = require('multer');
const sharp      = require('sharp');






// exports.uploadPhoto = upload.single('picture'), (req, res) => {
//   if (!req.file) {
//     console.log("No file received");
//     return res.send({
//       success: false
//     });

//   } else {
//     console.log('file received');
//     console.log('Request File: ');
//     console.log(req.file);


    // return res.send({
    //   success: true
    // })
//   }
// };

// exports.uploadPhoto = (req, res) => {
//   console.log('request: ' + req)
//   User.findOneAndUpdate(email = req.email , { profilePicture: newImage}, {returnNewDocument: true}, function( error, result){
//      if(error) {
//        res.status(400).send("There was an error updating the image");
//      }

//      if (!result) {
//        res.status(400).send('There was no user with that email');
//      }

//       res.status(200).send('Photo has been updated');
//   });
