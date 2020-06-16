const Mentor = require('../../models/mentor.model');
const nodemailer = require('nodemailer');

exports.getMentors = (req, res) => {
  console.log('Getting all Mentors');

  Mentor.find((err, mentor) => {
    if (err) return res.status(400).json('Error finding jobs');

    if(!mentor) return res.status(400).json('There are no mentors');

    return res.send(mentor);
  });
}

exports.addMentor = (req, res) => {

  let mentor = req.body.mentor;
  let photoURL = req.body.photoURL;

  if ( !mentor.name || !mentor.email || !mentor.address || !mentor.city || !mentor.state || !mentor.zip || !mentor.phone || !mentor.description || !mentor.photo   ) {
    return res.status(400).send('Please enter a name, email, address, city, state, description, and photo. You are missing one or more fields.');
  }

  let newMentor = Mentor(mentor);
  newMentor.photo = photoURL;

  newMentor.save( (err, mentor) => {
    if ( err ) {
      return res.status(400).send('There was an error saving the mentor to the database: \n\n' + err);
    }
    console.log('Added Mentor: ' + mentor);
    return res.status(200).send(mentor);
  })
}

exports.updateMentor = (req, res) => {

  if ( !req.body.name || !req.body.email || !req.body.address || !req.body.city || !req.body.state || !req.body.phone || !req.body.description || !req.body.photo   ) {
    return res.status(400).send('Please enter a name, email, address, city, state, description, and photo. You are missing one or more fields.');
  }

  let updatedMentor = req.body;
  let condition = { _id: req.body._id };

  Mentor.updateOne(condition, updatedMentor, (err, mentor) => {
    if ( err ) {
      return res.status(400).send('There was an error updating the mentor in the database: \n\n' + err);
    }

    console.log('Updated Mentor: ' + mentor);
    return res.status(200).send(mentor);
    }
  )
}

exports.deleteMentor = (req, res) => {

  Mentor.findByIdAndDelete( req.params._id, (err) => {
    if (err) return err;
  } );
  console.log(req);
  console.log(req.params._id + ' Mentor deleted');
  res.status(200).json(req.params._id + ' Mentor deleted');
}

