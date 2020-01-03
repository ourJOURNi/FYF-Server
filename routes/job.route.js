const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

var jobController  = require('../controller/job-controller');

// Change to /apply route after favorites are done
router.post('/', jobController.sendEmailApplication );
router.post('/favorite', jobController.favoriteJob );
router.post('/unfavorite', jobController.unFavoriteJob );

module.exports = router;
