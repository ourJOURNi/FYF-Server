const express = require("express");
const router = express.Router();
var photoController  = require('../controller/photo-controller');

router.post('/', photoController.uploadPhoto);

module.exports = router;