const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

var fairsController  = require('../../controller/admin/fairs-controller');

router.get('/', fairsController.getFairs );

router.post('/fair', fairsController.getFair );
router.post('/add-fair', fairsController.addFair );
router.post('/print-students', fairsController.printStudents);

router.delete('/delete-fair/:_id', fairsController.deleteFair );
router.post('/delete-student-agenda-item', fairsController.deleteStudentAgendaItem );
// router.delete('/delete-chaperone-agenda-item/:i', fairsController.deleteChapergitoneAgendaItem );
// router.delete('/delete-volunteer-agenda-item/:i', fairsController.deleteVolunteerAgendaItem );
// router.delete('/delete-partner-agenda-item/:i', fairsController.deletePartnerAgendaItem );

router.put('/update-fair', fairsController.updateFair );
// router.post('/register-partners', fairsController.registerPartners );

module.exports = router;