const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/',  (req, res) => {
  var code = req.body.code
  var email = req.body.email

  console.log(code);
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
  to: `${email}`, // list of receivers
  subject: 'United Way User Verification',
  html: `<p>Your 6 digit code is: ${code} </p>`
};

 transporter.sendMail(mailOptions, function (err, info) {
  if(err)
    console.log(err)
  else
    console.log(info);
});

  console.log('Posted on Login-Credentials');
  res.json('Posted on Login-Credentials').status(200);
});

router.post('/forgot-password',  (req, res) => {
  var code = req.body.code
  var email = req.body.email

  console.log(code);
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
  to: `${email}`, // list of receivers
  subject: 'United Way User - Forgot Password',
  html: `<p>Your 6 digit code is: ${code}. \n Please use this code in the app to reset your password. </p>`
};

 transporter.sendMail(mailOptions, function (err, info) {
  if(err)
    console.log(err)
  else
    console.log(info);
});

  console.log('Posted on Login-Credentials');
  res.json('Posted on Login-Credentials').status(200);
});

module.exports = router;
