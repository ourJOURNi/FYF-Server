const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

var eventController  = require('../controller/event-controller');

// Change to /apply route after favorites are done
router.get('/', eventController.getEvents );
router.post('/events-going', eventController.eventGoing );
router.post('/events-google-maps', eventController.eventGoogleMaps );

module.exports = router;