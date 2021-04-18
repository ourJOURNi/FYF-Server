const User = require('../models/user.model');
var forgotPasswordController  = require('../controller/forgot-password-controller');
const express = require("express");
const router = express.Router();

router.post("/", forgotPasswordController.checkIfUserExist)
router.post("/email-code", forgotPasswordController.emailCode)

module.exports = router;