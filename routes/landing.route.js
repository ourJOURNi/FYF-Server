const express = require("express");
const router = express.Router();
var userController  = require('../controller/user-controller');
var passport	    = require('passport');

router.get('/', (req, res) => {
  return res.send('You are at the landing page');
})
router.post('/', userController.loginUser);


module.exports = router;