const User = require('../models/user.model');
const nodemailer = require('nodemailer');

exports.favoriteJob = (req, res) => {
  // post it to users favoriteJobs array in User Model
  User.findOneAndUpdate(
    { email: req.body.userEmail },
    { $push: { favoriteJobs: req.body }},
    (err, user) => {

    if (err) {
      console.log('Error finding user in database');
    }
    if (!user) {
      console.log('This user does not exist');
    }
    console.log('Favoriting Jobs');
    res.status(200).send(user);
  })

}

exports.unFavoriteJob = (req, res) => {

  // find user
  // pull from favoriteJobs if the requested job's _id matches an _id from the favoriteJobs array.
   User.findOneAndUpdate(
     { email: req.body.userEmail },
     { $pull: { favoriteJobs: { _id: req.body._id }}  },
     (err, user) => {

      if (err) {
        console.log('Error finding user in database');
      }
      if (!user) {
        console.log('This user does not exist');
      }
      console.log('Unfavoriting Jobs');
      res.status(200).send(user.favoriteJobs);
     }
   )
}

exports.sendEmailApplication = (req, res) => {
  var user = req.body
  console.log(user);
  // Set transport service which will send the emails
  var transporter =  nodemailer.createTransport({
    service: 'gmail',
    auth: {
          user: 'eddielacrosse2@gmail.com',
          pass: 'taliaferro2'
      },
      // debug: true, // show debug output
      // logger: true // log information in console
  });

//  configuration for email details
 const mailOptions = {
  from: 'eddielacrosse2@gmail.com', // sender address
  to: `${user.jobCompanyEmail}`, // list of receivers
  subject: `United Way User ${user.fullName} Has Applied for your Position of ${user.jobTitle}`,
  html: `
  <p>${user.fullName} has applied for the job of ${user.jobTitle} </p>
  <p>Age ${user.dob}</p>
  <p>Gender ${user.gender}</p>
  <p>Address ${user.addressOne}, ${user.addressOne},${user.city}, ${user.state}, ${user.zip}</p>
  <p>School ${user.school}</p>
  <p>Grade ${user.grade}</p>
  <p>Email ${user.email}</p>
  <p>Profile Picture: ${user.profilePicture}</p>
  <p>Resume ${user.resume}</p>
  `
};

 transporter.sendMail(mailOptions, function (err, info) {
  if(err)
    console.log(err)
  else
    console.log(info);
});

  console.log('Applied for Job');
  res.json('Applied for Job').status(200);
}