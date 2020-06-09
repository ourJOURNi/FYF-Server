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
  <img style="width: 100px; margin: 20px 0 20px;" src="cid:unique@logo.ee"/><br/>
  <img style="width: 120px; margin-top: 10px; border-radius: 100px" src="cid:unique@profile.ee" /><br/>
  <h3>${mentorMessage.studentName}'s information: </h3>
  <p>From: ${mentorMessage.studentCity}, ${mentorMessage.studentState}</p>
  <p>Grade: ${mentorMessage.studentGrade}</p>
  <p>School: ${mentorMessage.studentSchool}</p>
  <p>Email: ${mentorMessage.studentEmail}</p><br>
  <h3>Message:</h3>
  <p style="white-space: pre-wrap">${mentorMessage.message.message}</p><br/>
  <h3>This user's resume, if any, is attached to this message.</h3>
  `,
  attachments: [
    {
      filename: 'fyf-logo-2.png',
      path: './assets/fyf-logo-2.png',
      cid: 'unique@logo.ee' //same cid value as in the html img src
    },
    {
      filename: `${mentorMessage.studentName}'s Profile Picture.jpg`,
      path: `${mentorMessage.studentProfilePic}`,
      cid: 'unique@profile.ee'
    },
    {
      filename: `${mentorMessage.studentName}'s Resume.pdf`,
      path: `${mentorMessage.studentResume}`,
      contentType: 'application/pdf'
    }
  ]
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
