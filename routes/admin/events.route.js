const express = require("express");
const router  = express.Router();
var eventsController  = require('../../controller/admin/events-controller');

router.get('/',  eventsController.getEvents)
router.post('/add-event', eventsController.addEvent)
router.put('/update-event', eventsController.updateEvent)
router.delete('/delete-event/:_id', eventsController.deleteEvent)

module.exports = router;