const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

var fairsController  = require('../controller/fairs-controller');

// Change to /apply route after favorites are done
router.get('/', fairsController.getFairs );
router.post('/fair', fairsController.getFair );
router.post('/register-student', fairsController.registerStudent );
router.post('/register-chaperone', fairsController.registerChaperone );
router.post('/register-partner', fairsController.registerPartner );
// router.post('/events-google-maps', fairsController.eventGoogleMaps );

module.exports = router;