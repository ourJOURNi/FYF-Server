const User = require('../models/user.model');
const nodemailer = require('nodemailer');



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
  res.end('Applied for Job').status(200);
}