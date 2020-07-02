const express = require("express");
const router = express.Router();

const photoController = require('../../controller/admin/photo-controller');

const JOB_LOGO_DIR = 'job-logos';
const EVENT_PHOTOS_DIR = 'event-photos';
const MENTOR_PHOTOS_DIR = 'mentor-pictures';

router.post('/upload-job-logo', photoController.jobLogoUpload.single('companyLogo'), (req, res) => {
  console.log('Middleware job logo file(s): ', req.file);
  photoController.uploadImage(JOB_LOGO_DIR, req.file.path, req.file.filename, res);
})
router.post('/upload-event-photo', photoController.eventPhotoUpload.single('eventPhoto'), (req, res) => {
  console.log('Middleware event photo file(s): ', req.file);
  photoController.uploadImage(EVENT_PHOTOS_DIR, req.file.path, req.file.filename, res);
})
router.post('/upload-mentor-photo', photoController.mentorPhotoUpload.single('mentorPhoto'), (req, res) => {
  console.log('Middleware mentor photo file(s): ', req.file);
  photoController.uploadImage(MENTOR_PHOTOS_DIR, req.file.path, req.file.filename, res);
})

module.exports = router;