const Image      = require('../models/image.model');
const User       = require('../models/user.model');
const aws        = require('aws-sdk');
const multer     = require('multer');
const multerS3   = require('multer-s3');
const sharp      = require('sharp');
const dotenv     = require('dotenv');

