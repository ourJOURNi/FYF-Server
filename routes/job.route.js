const express = require("express");
const router = express.Router();

var jobController  = require('../controller/job-controller');

router.get('/', jobController.getJobs );
router.post('/send-application', jobController.sendEmailApplication );
router.post('/get-favorites', jobController.getFavorites)
router.post('/favorite', jobController.favoriteJob );
router.post('/unfavorite', jobController.unFavoriteJob );

module.exports = router;
