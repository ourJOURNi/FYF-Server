const aws        = require('aws-sdk');
const multer     = require('multer');
const dotenv     = require('dotenv');
const express    = require("express");
const router     = express.Router();
const fs         = require('fs');
const path       = require('path');
const cloudfront = require('aws-cloudfront-sign');



// Allows for us to use Environment Files
dotenv.config();

// Configures AWS settings relative to S3
aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: 'us-east-2'
})

// Configure CloudFront settings
const cf_options = {
  keypairId: process.env.CLOUDFRONT_ACCESS_ID,
  privateKeyPath: process.env.CLOUDFRONT_PRIVATE_KEY_PATH,
}

getFileLink = (filename) => {
  return new Promise( (resolve, reject) => {
    console.log('Getting Link from CloudFront...')
    var signedUrl = cloudfront.getSignedUrl(process.env.CLOUDFRONT_RESUMES_URL + filename, cf_options);
    resolve(signedUrl);
  });
}




// Creates a S3 instances
const s3 = new aws.S3();

// Creates directory for profile pictures
const resumeStorage = multer.diskStorage({
  destination : 'resume-uploads/',

  filename: function (req, file, cb) {
    // Adding the current date to each filename so that each file is unique
    cb(null, Date.now() + '_resume');
  }
});

const upload = multer({
  storage: resumeStorage,
  // Filters what the files that are uploaded
  fileFilter: ( req, file, callback ) => {
    var ext = path.extname(file.originalname)

    // Make sure that the image file is either a .jpg, .jpeg, or .png file.
    if( ext === '.pdf' || ext === '.doc' || ext === '.docx' || ext === '.txt') {
       console.log('The file extention is correct. Good Job!')
    } else {
      return callback(new Error('Only pdf, doc, docx, or txt  files are allowed.'))
    }
  callback(null, true)
  }});

  uploadResume = ( source, targetName, res ) => {

    // source = full path of uploaded file
    // example : profile-picture-uploads/1588052734468_profile-picture
    // targetName = filename of uploaded file

    console.log('preparing to upload resume...');

    fs.readFile( source, ( err, filedata ) => {

      if (!err) {

        //  Creates Object to be stored in S3
        const putParams = {
            Bucket      : process.env.S3_BUCKET_NAME + '/resumes',
            Key         : targetName,
            Body        : filedata
        };

        s3.putObject(putParams, function(err, data){
          if (err) {
            console.log('Could not upload the file. Error :', err);
            return res.send({success:false});
          }
          else {
            // Remove file from profile-picture-uploads directory
            fs.unlink(source, () => {
              console.log('Successfully uploaded the file. ' + source + ' was deleted from server directory');
            });

            getFileLink(targetName);
            return res.send({success:true});
          }
        });
      }
      else{
        console.log({'err':err});
      }
    });
  }

    router.post('/upload-resume', upload.single('resume'), (req, res) => {
      //Multer middleware adds file(in case of single file ) or files(multiple files) object to the request object.
      console.log(req.file);
      uploadResume(req.file.path, req.file.filename ,res);
    })

    module.exports = router;