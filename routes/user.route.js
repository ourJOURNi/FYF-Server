const express = require("express");
var profileController  = require('../controller/profile-controller');
const router = express.Router();

router.post('/', profileController.getUserDetails);
router.post('/their-details', profileController.getTheirDetails);
router.post('/change-email', profileController.changeEmail)
router.post('/change-password', profileController.changePassword)
router.post('/change-about', profileController.changeAbout)
// router.post('/change-location', profileController.changeLocation)
router.post('/change-school', profileController.changeSchool)


module.exports = router;