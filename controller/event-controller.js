const Event = require('../models/events.model');

exports.getEvents = (req, res) => {
  Event.find( (err, events) => {
    if (err) return res.status(400).send('Error finding events');
    return res.status(200).send(events);
  })
}

exports.eventGoing = (res, req) => {

}

exports.eventGoogleMaps = (res, req) => {

}