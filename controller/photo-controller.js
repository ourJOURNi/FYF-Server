const Image      = require('../models/image.model');
const User       = require('../models/user.model');
const aws        = require('aws-sdk');
const multer     = require('multer');
const multerS3   = require('multer-s3');
const sharp      = require('sharp');
const dotenv     = require('dotenv');

dotenv.config();

aws.config.update({
    secretAccessKey: process.env.secretAccessKey,
    accessKeyId: process.env.accessKeyId,
    region: 'us-east-2'
})

const s3 = new aws.S3();

const storage = multer.diskStorage({
    destination : 'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === 'image/jpeg' ||
//         file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg'
//         ) {
//             cb(null, true);
//         } else {
//             cb(new Error('Wrong file type, only upload JPEG, JPG, or PNG !'),
//      false);
//         }
// };