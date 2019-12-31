const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();
var jobController  = require('../controller/job-controller');

router.post('/', jobController.sendEmailApplication );

module.exports = router;
