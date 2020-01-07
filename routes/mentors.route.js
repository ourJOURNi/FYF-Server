const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

var mentorController  = require('../controller/mentor-controller');

// Change to /apply route after favorites are done
router.get('/', mentorController.getMentors );
router.post('/mentor-message', mentorController.mentorMessage );

module.exports = router;