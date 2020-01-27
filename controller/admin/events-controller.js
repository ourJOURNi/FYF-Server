const Event = require('../../models/events.model');
const nodemailer = require('nodemailer');
const date = require('date-fns');

exports.getEvents = (req, res) => {
  console.log('Getting all Mentors');

  Event.find((err, event) => {
    if (err) return res.status(400).json('Error finding events');

    if(!event) return res.status(400).json('There are no events');

    return res.send(event);
  });
}

exports.addEvent = (req, res) => {

  let event = {
    title: req.body.title,
    organizer: req.body.organizer,
    addressOne: req.body.addressOne,
    addressTwo: req.body.addressTwo,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    // Date of the event
    date: req.body.date,
    time: req.body.time,
    // Date the event was created
    dateCreated: Date.now(),
    description: req.body.description,
    photo: req.body.photo,

  }

  let newEvent = Event(event);
  

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

