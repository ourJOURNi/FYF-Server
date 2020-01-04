const express = require("express");
const router  = express.Router();
var mentorsController  = require('../../controller/admin/mentors-controller');

router.get('/',  mentorsController.getMentors)
router.post('/add-mentor', mentorsController.addMentor)
router.put('/update-mentor', mentorsController.updateMentor)
router.delete('/delete-mentor/:_id', mentorsController.deleteMentor)

module.exports = router;