const Event = require('../../models/events.model');
const nodemailer = require('nodemailer');

exports.getEvents = (req, res) => {
  console.log('Getting all Mentors');

  Event.find((err, event) => {
    if (err) return res.status(400).json('Error finding events');

    if(!event) return res.status(400).json('There are no events');

    return res.send(event);
  });
}

exports.addEvent = (req, res) => {

  if ( !req.body.title || !req.body.organizer || !req.body.location || !req.body.date || !req.body.description || !req.body.photo   ) {
    return res.status(400).send('Please enter a title, organizer, location, date, description, and photo. You are missing one or more fields.');
  }

  let newEvent = Event(req.body);

  newEvent.save( (err, event) => {
    if ( err ) {
      return res.status(400).send('There was an error saving the event to the database: \n\n' + err);
    }
    console.log('Added Event: ' + event);
    return res.status(200).send(event);
  })
}

exports.updateEvent = (req, res) => {

  if (!req.body._id  ) {
    return res.status(400).send('There was no _id in the request body');
  }

  let updatedEvent = req.body;
  let condition = { _id: req.body._id };

  Event.updateOne(condition, updatedEvent, (err, event) => {
    if ( err ) {
      return res.status(400).send('There was an error updating the event in the database: \n\n' + err);
    }

    console.log('Updated Event: ' + event);
    return res.status(200).send(event);
    }
  )
}

exports.deleteEvent = (req, res) => {

  Event.findByIdAndDelete( req.params._id, (err) => {
    if (err) return err;
  } );
  console.log(req);
  console.log(req.params._id + ' Event deleted');
  res.status(200).json(req.params._id + ' Event deleted');
}

