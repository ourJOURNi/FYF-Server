const express = require("express");
const router  = express.Router();
var jobsController  = require('../../controller/admin/jobs-controller');

router.get('/',  jobsController.getJobs)
router.post('/add-job', jobsController.addJob)
router.put('/update-job', jobsController.updateJob)
router.delete('/delete-job/:id', jobsController.deleteJob)

module.exports = router;