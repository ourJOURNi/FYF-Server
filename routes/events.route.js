const express = require("express");
const router = express.Router();

var eventController  = require('../controller/event-controller');

// Change to /apply route after favorites are done
router.get('/', eventController.getEvents );
router.post('/events-going', eventController.getEventsGoing );
router.post('/go-to-event', eventController.goingToEvent );
router.post('/dont-go-to-event', eventController.notGoingToEvent );
router.post('/delete-event', eventController.deleteEvent );

module.exports = router;