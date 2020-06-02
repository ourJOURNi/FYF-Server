const Mentor = require('../models/mentor.model');
const nodemailer = require('nodemailer');

exports.getMentors = (req, res) => {
  Mentor.find( (err, mentors) => {
    if (err) {
      return res.status(400).send('Error finding mentors')
    };
    return res.status(200).send(mentors);
  })
}

exports.mentorMessage = (req, res) => {
  mentorMessage = req.body;
  console.log(mentorMessage)

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
  to: `${mentorMessage.mentorEmail}`, // list of receivers
  subject: `Find Your Future -- ${mentorMessage.studentName} sent you a message.`,
  html: `
  <br>
  <br>
  <img style="width: 100px" src="cid:unique@logo.ee"/>
  <br>
  <h3>${mentorMessage.studentName}'s information: </h3>
  <br>
  <p>From: ${mentorMessage.studentCity}, ${mentorMessage.studentState}</p>
  <p>Grade: ${mentorMessage.studentGrade}</p>
  <p>School: ${mentorMessage.studentSchool}</p>
  <p>Email: ${mentorMessage.studentEmail}</p>
  <p>Pro Pic: ${mentorMessage.studentProfilePic}</p>
  <br>
  <h3>Message:</h3>
  <p>${mentorMessage.message.message}</p>
  `,
  attachments: [{
    filename: 'fyf-logo-2.png',
    path: './assets/fyf-logo-2.png',
    cid: 'unique@logo.ee' //same cid value as in the html img src
}]
};

 transporter.sendMail(mailOptions, function (err, info) {
  if(err)
    console.log(err)
  else
    console.log(info);
});

  console.log('Sent message to Mentor.');
  res.json('Sent message to Mentor.').status(200);
}
