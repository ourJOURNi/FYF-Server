const express           = require("express");
const router = express.Router();
var jobsController  = require('../../controller/admin/jobs-controller');

router.get('/',  jobsController.getJobs)

router.post('/add-job', jobsController.addJob)

router.delete('/delete-job', jobsController.deleteJob)

module.exports = router;