const Event = require('../models/events.model');
const User = require('../models/user.model');

exports.getEvents = (req, res) => {
  Event.find( (err, events) => {
    if (err) return res.status(400).send('Error finding events');
    return res.status(200).send(events);
  })
}

exports.getEventsGoing = (req, res) => {

  let userEmail = req.body.userEmail;

  User.findOne(
    {email: userEmail},
    (err, user) => {
    if (err) return res.status(400).send('Error finding events');
    return res.status(200).send(user);
  })
}

exports.goingToEvent = (req, res) => {

  console.log(req.body);

  let eventID = req.body.eventID;
  let id = req.body.id;
  let userEmail = req.body.userEmail;
  // save eventID to users EventGoing array

  Event.findByIdAndUpdate(
    { _id: eventID},
    {  $push: { going: userEmail } },
    ( err, event ) => {

      User.findByIdAndUpdate(
        id,
        { $push: { eventsGoing: eventID }},
        ( err, user) => {

          if (!user) return res.status(400).json({message: 'There was no user with that id'});

          if (err) return res.status(400).json(err);
          console.log('Updating Users events they are going to');
          res.status(200).json(user);
        }
      )
    }
  )
}

exports.notGoingToEvent = (req, res) => {

  let eventID = req.body.eventID;
  let userEmail = req.body.userEmail;

  Event.findByIdAndUpdate(
    { _id: eventID},
    {  $pull: { going: userEmail } },
    ( err, event ) => {

    if (err) return res.status(400).json(err);

      User.findOneAndUpdate(
        { email: userEmail },
        { $pull: { going: userEmail }},
        ( err, user) => {

          if (!user) return res.status(400).json({message: 'There was no user with that id'});

          if (err) return res.status(400).json(err);
          console.log('Updating Users events they are going to');
          res.status(200).json(user);
        }
      )
    }
  )



}

exports.eventGoogleMaps = (res, req) => {

}