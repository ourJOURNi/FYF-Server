const express = require("express");
const router = express.Router();
var photoController  = require('../controller/photo-controller');

const multer     = require('multer');
const sharp      = require('sharp');


var storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, 'profile-' + file.fieldname + '-' + Date.now() + '.jpeg');
  }
})

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    let ext = file.mimetype;
    if(ext !== 'image/png' && ext !== 'image/jpg' && ext !== 'image/jpeg') {
        return callback(new Error('Only images are allowed'))
    }

    callback(null, true)
},
limits:{
  // 10 megabytes
  // 1e+7
    fileSize: 10000000
} })

router.post('/', upload.single('picture'), (req, res) => {
  if (!req.file) {

    console.log("No file received");
    return res.json({
      success: false
    });

  } else {
    console.log('File Resized');
    return res.json({
      success: true
    });
  }
});

module.exports = router;