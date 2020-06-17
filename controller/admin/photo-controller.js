const aws       = require('aws-sdk');
const multer    = require('multer');
const dotenv    = require('dotenv');
const express   = require("express");
const router    = express.Router();
const fs        = require('fs');
const path      = require('path');

const Job       = require('../../models/job.model');
const Event     = require('../../models/events.model');
const Mentor    = require('../../models/mentor.model');

dotenv.config();

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: 'us-east-2'
});

// Create an S3 instance
const s3 = new aws.S3();

// Local directory for job logos
const jobLogoStorage = multer.diskStorage({
  destination : 'job-logo-uploads/',
  filename: function (req, file, cb) {
    let counter = 1;
    // Adding the a counter and current date to each filename so that each file is unique
    cb(null, '00' + counter + '00' + Date.now() + '_job-logo' + path.extname(file.originalname));
  }
});

exports.jobLogoUpload = multer({
  storage: jobLogoStorage,
  // Filters what the files that are uploaded
  fileFilter: ( req, file, callback ) => {
    console.log('This is the file');
    console.log(file);

    // captures to extension of the file e.i .png
    var ext = path.extname(file.originalname)

    // Makes sure that the image file is either a .jpg, .jpeg, or .png file.
    if( ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
       console.log('The file extention is correct. Good Job!')
    } else {
      return callback(new Error('Only jpg, jpeg, or png image files are allowed.'))
    }
  callback(null, true)
  },
  limits: 1024 * 1024
});

// Local directory for event photos
const eventPhotoStorage = multer.diskStorage({
  destination : 'event-photo-uploads/',
  filename: function (req, file, cb) {
    let counter = 1;
    // Adding the a counter and current date to each filename so that each file is unique
    cb(null, '00' + counter + '00' + Date.now() + '_event-photo' + path.extname(file.originalname));
  }
});

exports.eventPhotoUpload = multer({
  storage: eventPhotoStorage,
  // Filters what the files that are uploaded
  fileFilter: ( req, file, callback ) => {
    console.log('This is the file');
    console.log(file);

    // captures to extension of the file e.i .png
    var ext = path.extname(file.originalname)

    // Makes sure that the image file is either a .jpg, .jpeg, or .png file.
    if( ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
       console.log('The file extention is correct. Good Job!')
    } else {
      return callback(new Error('Only jpg, jpeg, or png image files are allowed.'))
    }
  callback(null, true)
  },
  limits: 1024 * 1024
});

// Local directory for mentor photos
const mentorPhotoStorage = multer.diskStorage({
  destination : 'mentor-photo-uploads/',
  filename: function (req, file, cb) {
    let counter = 1;
    // Adding the a counter and current date to each filename so that each file is unique
    cb(null, '00' + counter + '00' + Date.now() + '_mentor-photo' + path.extname(file.originalname));
  }
});

exports.mentorPhotoUpload = multer({
  storage: mentorPhotoStorage,
  // Filters what the files that are uploaded
  fileFilter: ( req, file, callback ) => {
    console.log('This is the file');
    console.log(file);

    // captures to extension of the file e.i .png
    var ext = path.extname(file.originalname)

    // Makes sure that the image file is either a .jpg, .jpeg, or .png file.
    if( ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
       console.log('The file extention is correct. Good Job!')
    } else {
      return callback(new Error('Only jpg, jpeg, or png image files are allowed.'))
    }
  callback(null, true)
  },
  limits: 1024 * 1024
});

/**
   * @param source full path of uploaded file.
   * Example: job-logo-uploads/128883823298932_job-logo
   * @param targetName Filename of uploaded file
   */
exports.uploadImage = (directory, source, targetName, res) => {

  var counter = 1;

  console.log(`Preparing upload to ${directory}...`);

  // Increase counter and append its number to each filename every time the uploadImage method is called.
  if (counter >= 1 ) {
    ++counter;
    console.log('Counter: ' + counter)
  }

  // Read the file, upload the file to S3, then delete file from the local directory.
  fs.readFile( source, ( err, filedata ) => {

    if (!err) {

      //  Creates Object to be stored in S3
      const putParams = {
          Bucket  : process.env.S3_BUCKET_NAME + `/${directory}`,
          Key     : targetName,
          Body    : filedata,
          ACL     : 'public-read'
      };

        s3.putObject(putParams, function(err, data){
          if (err) {
            console.log('Could not upload the file. Error :', err);
            return res.send({success:false});
          }
        else {
          console.log('Data from uploading to S3 Bucket: ');
          console.log(data);

          let objectUrl = `https://find-your-future.s3.us-east-2.amazonaws.com/${directory}/${targetName}`;

          // Remove file from the local directory
          fs.unlink(source, () => {
            console.log('Successfully uploaded the file. ' + source + ' was deleted from server directory');
            console.log(objectUrl)
            return res.status(200).json({objectUrl});
          });
        }
      })
    }
    else{
      console.log({'err':err});
    }
  });
}
