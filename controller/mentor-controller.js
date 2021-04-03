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
  var mentorMessage = req.body;
  console.log(mentorMessage)
  let fyfLogo = "https://find-your-future.s3.us-east-2.amazonaws.com/app-logo/fyf-logo-2.png";

  // Set transport service which will send the emails
  var transporter =  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
          user: 'info@findyourfuturesem.org',
          type: 'OAuth2',
          serviceClient: '114638852401053554429',
          privateKey: privateKey
      },
      debug: true, // show debug output
      logger: true // log information in console
  });

//  configuration for email details
 const mailOptions = {
  from: 'info@findyourfuturesem.org', // sender address
  to: `${mentorMessage.mentorEmail}`, // list of receivers
  subject: `Find Your Future -- ${mentorMessage.studentName} sent you a message.`,
  html: `
  <img style="width: 200px; margin: 20px 0 20px" src="${fyfLogo}" /><br/>
  <img style="width: 120px; margin-top: 10px; border-radius: 100px" src= ${profilePicture} /><br/>
  <h3>${mentorMessage.mentorMessage.studentName}'s information: </h3>
  <p>From: ${mentorMessage.studentCity}, ${mentorMessage.studentState}</p>
  <p>Grade: ${mentorMessage.studentGrade}</p>
  <p>School: ${mentorMessage.studentSchool}</p>
  <p>Email: ${mentorMessage.studentEmail}</p><br>
  <h3>Message:</h3>
  <p style="white-space: pre-wrap">${mentorMessage.message.message}</p><br/>
  <h3>This user's resume, if any, is attached to this message.</h3>
  `,
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
