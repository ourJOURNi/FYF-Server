const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/',  (req, res) => {
  var code = req.body.code
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
  to: 'eddielacrosse2@gmail.com', // list of receivers
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
  res.end('Posted on Login-Credentials').status(200);
});

module.exports = router;
