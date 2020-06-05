const aws        = require('aws-sdk');
const multer     = require('multer');
const dotenv     = require('dotenv');
const express    = require("express");
const router     = express.Router();
const fs         =require('fs');
const path       = require('path');

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
const profilePictureStorage = multer.diskStorage({
    destination : 'profile-picture-uploads/',

    filename: function (req, file, cb) {
      // Adding the a counter and current date to each filename so that each file is unique
      cb(null, '00' + counter + '00' + Date.now() + '_profile-picture');
    }
});

const upload = multer({
  storage: profilePictureStorage,
  // Filters what the files that are uploaded
  fileFilter: ( req, file, callback ) => {
    console.log('This is the file');

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
  limits: 1024 * 1024 });

uploadProfilePicture = ( source, targetName, res ) => {

  // source = full path of uploaded file
  // example : profile-picture-uploads/1588052734468_profile-picture
  // targetName = filename of uploaded file

  console.log('preparing to profile picture upload...');

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
          Bucket      : process.env.S3_BUCKET_NAME + '/profile-pictures',
          Key         : targetName,
          Body        : filedata
      };

      s3.putObject(putParams, function(err, data){
        if (err) {
          console.log('Could not upload the file. Error :', err);
          return res.send({success:false});
        }
        else {
          console.log('Data from uploading to S3 Bucket: ');
          console.log(data);

          const getParams = {
            Bucket: process.env.S3_BUCKET_NAME + '/profile-pictures',
            Key: targetName
          };

          s3.getObject(getParams, (data, err) => {
            if(err) {
              console.log('error');
              return res.status(400).json({err: err})
            }
            console.log('Data:')
            console.log(data)
            return res.send({success:true});
          });

          // Remove file from profile-picture-uploads directory
          fs.unlink(source, () => {
            console.log('Successfully uploaded the file. ' + source + ' was deleted from server directory');
          });
        }
      })


      
    }
    else{
      console.log({'err':err});
    }
  });
}

//The retrieveFile function
function retrieveFile(filename,res){


}

router.post('/upload-profile-picture', upload.single('profile-picture'), (req, res) => {
  //Multer middleware adds file(in case of single file ) or files(multiple files) object to the request object.
  console.log(req.file);

  // uploadProfilePicture(source, targetName, res)
  uploadProfilePicture(req.file.path, req.file.filename ,res);
  retrieveFile(req.file.filename, res)
})

module.exports = router;