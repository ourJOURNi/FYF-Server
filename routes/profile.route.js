const express = require("express");
const User = require('../models/user.model');
var profileController  = require('../controller/profile-controller');
const router = express.Router();

router.post('/', profileController.getUserDetails);
router.post('/change-email', profileController.changeEmail)
router.post('/change-password', profileController.changePassword)
router.post('/change-phone', profileController.changePhone)
router.post('/change-address', profileController.changeAddress)
router.post('/change-school', profileController.changeSchool)
router.post('/change-profile-picture', profileController.changeProfilePicture)
router.post('/change-resume', profileController.changeResume)

module.exports = router;