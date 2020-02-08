const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

var fairsController  = require('../../controller/admin/fairs-controller');

router.get('/', fairsController.getFairs );

router.post('/add-fair', fairsController.addFair );
router.delete('/delete-fair/:_id', fairsController.deleteFair );
router.put('/update-fair', fairsController.updateFair );
// router.post('/register-partners', fairsController.registerPartners );
// router.post('/events-google-maps', fairsController.eventGoogleMaps );

module.exports = router;