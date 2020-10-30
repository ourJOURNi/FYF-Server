const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

var fairsController  = require('../../controller/admin/fairs-controller');

router.get('/', fairsController.getFairs );

router.post('/fair', fairsController.getFair );
router.post('/add-fair', fairsController.addFair );
router.post('/print-students', fairsController.printStudents);
router.delete('/delete-fair/:_id', fairsController.deleteFair );

router.post('/add-student-agenda-item', fairsController.addStudentAgendaItem );
router.post('/delete-student-agenda-item', fairsController.deleteStudentAgendaItem );
router.post('/edit-student-agenda-item', fairsController.editStudentAgendaItem );

router.post('/add-chaperone-agenda-item', fairsController.addChaperoneAgendaItem );
router.post('/delete-chaperone-agenda-item', fairsController.deleteChaperoneAgendaItem );
router.post('/edit-chaperone-agenda-item', fairsController.editChaperoneAgendaItem );

router.post('/add-partner-agenda-item', fairsController.addPartnerAgendaItem );
router.post('/delete-partner-agenda-item', fairsController.deletePartnerAgendaItem );
router.post('/edit-partner-agenda-item', fairsController.editPartnerAgendaItem );
router.post('/delete-partner-faq', fairsController.deletePartnerFAQ );
router.post('/add-partner-faq', fairsController.addPartnerFAQ );
router.post('/edit-partner-faq', fairsController.editPartnerFAQ );

router.post('/add-volunteer', fairsController.addVolunteer );
router.post('/edit-volunteer', fairsController.editVolunteer );
router.post('/delete-volunteer', fairsController.deleteVolunteer );
router.post('/add-volunteer-agenda-item', fairsController.addVolunteerAgendaItem );
router.post('/delete-volunteer-agenda-item', fairsController.deleteVolunteerAgendaItem );
router.post('/edit-volunteer-agenda-item', fairsController.editVolunteerAgendaItem );
router.post('/delete-volunteer-faq', fairsController.deleteVolunteerFAQ );
router.post('/add-volunteer-faq', fairsController.addVolunteerFAQ );
router.post('/edit-volunteer-faq', fairsController.editVolunteerFAQ );

// router.delete('/delete-chaperone-agenda-item/:i', fairsController.deleteChapergitoneAgendaItem );
// router.delete('/delete-volunteer-agenda-item/:i', fairsController.deleteVolunteerAgendaItem );
// router.delete('/delete-partner-agenda-item/:i', fairsController.deletePartnerAgendaItem );

router.put('/update-fair', fairsController.updateFair );
// router.post('/register-partners', fairsController.registerPartners );

module.exports = router;