const aws        = require('aws-sdk');
const multer     = require('multer');
const dotenv     = require('dotenv');
const express    = require("express");
const router     = express.Router();
const fs         =require('fs');
const path       = require('path');
const User       = require('../models/user.model');


// Allows for us to use Environment Files
dotenv.config();

// Configures AWS settings relative to S3
aws.config.update({
    secretAccessKey: process.env.AWS_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_ID,
    region: 'us-east-2'
})

// Creates a S3 instances
const s3 = new aws.S3();

// counter for picture storage file names
// appends a prefix of 00+counter+00+ to Date.now()_profile-picture for filenames.
var counter = 1;

// Creates directory for profile pictures
const resumeStorage = multer.diskStorage({
    destination : 'resume-uploads/',

    filename: function (req, file, cb) {
      // Adding the a counter and current date to each filename so that each file is unique
      cb(null, '00' + counter + '00' + Date.now() + '_resume');
    }
});

const upload = multer({
  storage: resumeStorage,
  // Filters what the files that are uploaded
  fileFilter: ( req, file, callback ) => {
  callback(null, true)
  },
  limits: 1024 * 1024 });

uploadResume = ( file, source, targetName, res ) => {

  // source = full path of uploaded file
  // example : profile-picture-uploads/1588052734468_profile-picture
  // targetName = filename of uploaded fileconsole.log('This is the file');
  console.log(file)

    // captures to extension of the file e.i .png
    var ext = path.extname(file.originalname)

    // Makes sure that the resume is a PDF file
    if( ext === '.pdf') {
       console.log('The file extention is correct. Good Job!')
    } else {
      console.error('File needs to be .pdf')
       return res.status(400).json({msg: 'File needs to be a .pdf file'})
    }

  console.log('preparing resume upload...');

  // Increase counter and append its number to each filename every time the uploadProfilePicture method is called.
  if (counter >= 1 ) {
    ++counter;
    console.log('Counter: ' + counter)
  }

  // Read the file, upload the file to S3, then delete file from the directory 'profile-picture-uploads'.
  fs.readFile( source, ( err, filedata ) => {

    if (!err) {

      //  Creates Object to be stored in S3
      const putParams = {
          Bucket      : process.env.S3_BUCKET_NAME + '/resumes',
          Key         : targetName,
          Body        : filedata,
          ContentType  : 'application/pdf',
          ACL   : 'public-read'
      };

      s3.putObject(putParams, function(err, data){
        if (err) {
          console.log('Could not upload the file. Error :', err);
          return res.send({success:false});
        }
        else {
          console.log('Data from uploading to S3 Bucket: ');
          console.log(data);

          let objectUrl = 'https://find-your-future.s3.us-east-2.amazonaws.com/resumes/'+targetName;

          // Remove file from profile-picture-uploads directory
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

uploadChangedResume = ( source, targetName, email, res ) => {

  // source = full path of uploaded file
  // example : profile-picture-uploads/1588052734468_profile-picture
  // targetName = filename of uploaded file

  console.log('preparing to update resume...');

  // Increase counter and append its number to each filename every time the uploadProfilePicture method is called.
  if (counter >= 1 ) {
    ++counter;
    console.log('Counter: ' + counter)
  }

  // Read the file, upload the file to S3, then delete file from the directory 'profile-picture-uploads'.
  fs.readFile( source, ( err, filedata ) => {

    if (!err) {

      //  Creates Object to be stored in S3
      const putParams = {
          Bucket      : process.env.S3_BUCKET_NAME + '/resumes',
          Key         : targetName,
          Body        : filedata,
          ContentType  : 'application/pdf',
          ACL   : 'public-read'
      };

        s3.putObject(putParams, function(err, data){
          if (err) {
            console.log('Could not upload the file. Error :', err);
            return res.send({success:false});
          }
        else {
          console.log('Data from uploading to S3 Bucket: ');
          console.log(data);

          let objectUrl = 'https://find-your-future.s3.us-east-2.amazonaws.com/resumes/'+targetName;

          console.log(email)

          User.updateOne(
            {email: email},
            { $set: { 'resume': objectUrl }},
            (err, data) => {
              if (err) return res.status(400).json({message: 'err', error: err})
              if (!data) return res.status(400).json({message: 'There was no user with that email'});
              if (data) {
                console.log(data);

                // Remove file from profile-picture-uploads directory
                fs.unlink(source, () => {
                  console.log('Successfully uploaded the file. ' + source + ' was deleted from server directory');
                  console.log(objectUrl)
                  return res.status(200).json({objectUrl});
                });
              }
            }
          )
        }
      })
    }
    else{
      console.log({'err':err});
    }
  });
}

changeResume = (oldResumeKey, res) => {

  //  Creates Object to be stored in S3
  const deleteParams = {
    Bucket      : process.env.S3_BUCKET_NAME,
    Key         : oldResumeKey,
  };

  s3.deleteObject(deleteParams, function(err, data){
    if (err) {
      console.log('Could not upload the file. Error :', err);
      return res.send({success:false});
    } else {

      console.log('Deleting Resume from  S3 Bucket: ');
      console.log(data);
    }

  })
}


router.post('/upload-resume', upload.single('resume'), (req, res) => {
  //Multer middleware adds file(in case of single file ) or files(multiple files) object to the request object.

  // uploadProfilePicture(source, targetName, res)
  uploadResume(req.file, req.file.path, req.file.filename ,res);
})

router.post('/change-resume', upload.single('resume-update'), (req, res) => {
  //Multer middleware adds file(in case of single file ) or files(multiple files) object to the request object.

  console.log(req.body.oldResumeKey);
  console.log(req.body.email);

  changeResume(req.body.oldResumeKey)
  uploadChangedResume(req.file.path, req.file.filename, req.body.email , res);
})

module.exports = router;