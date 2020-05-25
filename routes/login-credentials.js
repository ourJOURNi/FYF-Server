const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require("bcrypt");


router.post('/',  (req, res) => {
  var code = req.body.code
  var email = req.body.email

  console.log(code);
  // Set transport service which will send the emails
  var transporter =  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
          user: 'aaron@journi.org',
          pass: 'Q9&Rji^5ft'
      },
      debug: true, // show debug output
      logger: true // log information in console
  });

//  configuration for email details
 const mailOptions = {
  from: 'aaron@journi.org', // sender address
  to: `${email}`, // list of receivers
  subject: 'Find Your Future User Verification',
  html:
  `
    <img style="width: 100px; margin: 35px 0 20px" src="cid:unique@logo.ee" />
    <h3>Here is your 6 digit code:</h3>
    <p>${code}</p>`,
  attachments: [{
    filename: 'fyf-logo-2.png',
    path: './assets/fyf-logo-2.png',
    cid: 'unique@logo.ee'
  }]
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


router.post('/forgot-password-email-code', (req, res) => {

  let email = req.body.email;
  let code = req.body.code;

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
    html: `
      <img style="width: 100px; margin: 35px 0 20px" src="cid:unique@logo.ee" />
      <h3>Here is your 6 digit code:</h3>
      <p>${code}.<br>Please use this code in the app to reset your password. </p>
    `,
    attachments: [{
      filename: 'fyf-logo-2.png',
      path: './assets/fyf-logo-2.png',
      cid: 'unique@logo.ee'
    }]
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log('error' + err)
    else
      console.log(info);
      res.status(200).json({msg: 'Password'})
  });

})


router.post('/forgot-password',  (req, res) => {

  console.log('Forgot Password Testing')
  console.log(req.body);

   // Create new hashed password
   bcrypt.genSalt(10, (err, salt) => {

    if (err) return next(err);

    bcrypt.hash(req.body.newPassword, salt, (err, hash) => {

    console.log(req.body.password);
    console.log('New Password Hashed: ' + hash);

    let newPassword = hash;
    let filter = { email: req.body.email };
    let update = { password: newPassword }

    User.updateOne(filter, update)
      .then( data => {
        console.log('Updated Password: ' + JSON.stringify(data));
        res.status(200).json({msg: 'Password Changed'});
      })
      .catch( err => {
        console.log(err);
        res.status(400).end('There was an error');
      })
    })

  })

});

module.exports = router;
