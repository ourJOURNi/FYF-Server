const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require("bcrypt");

router.post('/',  (req, res) => {
  let code = req.body.code
  let email = req.body.email
  let privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC803Y4OMJdZs+j\ndCncd9v28ef+3YywJIF5T78G4Lq050d4XmRQ0nSfIw91mMT+bPC7/06VDJFkOBX8\nsFSLyrsqUDzUHoEx9Cp2BDlsCv45IYTckvU9WEdiZdo5ylYOL82Im2R/qnh1vbjv\nvhD7tRdSynwcrHT6Tn+X73e9fpWQMSwZe3Ilg6niw+N3zfUP3vy0KgVjQ72VvvVS\nZuXwNdTCUqphLizFGsXx32tfGk6SuNskDFPz8mlv0Q56o1b2VD8K2eJcktPa7dhs\nRZniB6CGLmh2teQPpWQvcdT160gK0whg1MZj0gdAFEFFwghSe6AeTca+LOYhqjOP\nxflNicajAgMBAAECggEAXhToctPI9/upWjIfR2OK/AwEwSaHGh5eSmDS96zSKh+Q\nKyewyNpLVB0Gb1vaT0BdY/Yto7L64BnXzqrWvT4aKleHL1MxoP+chmfNaolBqJqM\nVdB9E38gNiU0aZXocbIcsMNn+/omgdexRPaJBLjycYRE+Y5tzGd/SGb+3LIs+AXE\niScEvFEGHIIQ83cQQLBchtM9Ci0jDg3hzPI8JLtTcmg+IDlOQy4wlatE8GvKt3Vy\nBs+uzj1oPdhgzIj3kN0iqwvlA/qdv2fNEke1C96xZQK/7mKel89gxyef7gFMpaOE\n50T3naSBEwwE354HHc6iDDXTYIYE8DmPyq/8JebHrQKBgQDpoZm5+RwCmrdI9sG7\nL5qx/YN/KjFefoop2kuaV+6Tc9Dq2W5KH/aUN8UCUpHNiLyHQ2rw340XHkujWigw\n3bFiWl2tgP6AhnDrCR75tmCbujyTvMiPm9xTf681lc4cXtTTH7AG6jnbWb/ePYPx\nOCzuvdW+5u4NIwcTvS+3ektL/QKBgQDO56qbGLmHqrR/xhLxcvlMMprgEp2eMERW\nqfbSykgLqAx3jW4ahCXGnJFIKr0Pxys73aNKjJttwY9mxMGQ4oAIeEjOwX+7dJaL\nWUo/YesVJyslHJB2bFBwm3+xVeuYBQmHS/SttHqbBKBNGVmXPEGP69r4K4dzA+za\nvkuNVALPHwKBgQCDJ8Q8Adu2npJcNKJnaf8HAtGqNs6GRLVdb33XxJtbTb4vySZA\nGJd9d51yg1X0s1la+f70ABudqdU+e+NqI1psY1yJhYvaLR8A4xrvhnHPmopdSbKx\n5AaZHWoHw/R0OsxxRS21hBI80LKEmbYTWbznvcxbohprZ4mWjDNYZiAVJQKBgQCh\n5dKwU7Nw/dkJFiNifNWnkv1vEgH1cs02hv4UyKWBQXin36nk47xvYbmon5CalP02\ndeI9BjLkug2Mm67ewOzwM7a82doqAzt9RFv9po/9WE3BV02O7Igw5OwRBis4I9Dl\n5kBJ36wEOqV4Trq0xTiD9ki74cu16r9eFoMlzjP4fwKBgEKfkenPX1qRFfltQhkh\n0+THdV5d07oQ2Om7zlfrFkhuy1365+vWXweGKnssoy4hppTRwZHxoQ8yWz4wn4q0\nkA4h6wd4gL68Ep3yfHCDIgNvJvqsmekFLU9jitOLSQcAfEqRI+YAdpl3QDvAFz2h\na5ARENBovPmLFiVO7vIOoEfa\n-----END PRIVATE KEY-----\n';

  console.log(code);
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
