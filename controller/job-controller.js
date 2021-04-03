const User = require('../models/user.model');
const Job = require('../models/job.model');
const nodemailer = require('nodemailer');

exports.getJobs = (req, res) => {
    console.log('Getting all Jobs');

    Job.find((err, jobs) => {
      if (err) return res.status(400).send('Error finding jobs');
      return res.send(jobs);
    });
}

exports.getFavorites = (req, res) => {
  console.log('Getting all favorited Jobs');

  email = req.body.email;

  User.findOne(
    {email : email},
    async (err, favs) => {
      if (err) console.error("Error finding user");
      if (!favs) console.error("User wasn\'t found");
      
      let favoriteJobs = [];
      for (i = 0; i < favs.favoriteJobs.length; i++) {
        await Job.findById(
          favs.favoriteJobs[i],
          (err, jobs) => {
            if (err) console.error("Error finding favorite job");
            if (!jobs) console.error("Favorite job wasn\'t found");
            if (jobs) {
              favoriteJobs.push(jobs);
            }
          }
        )
      }
      console.log(`Favorite jobs result:\n${favoriteJobs}`);
      return res.send(favoriteJobs);
    }
  )
}

exports.favoriteJob = (req, res) => {

  email = req.body.email;
  console.log(`Favorite Request Object Id: ${req.body._id}`);

  // post it to users favoriteJobs array in User Model
  User.findOneAndUpdate(
    { email: email },
    { $push: { favoriteJobs: req.body._id }},
    { new : true },
    (err, user) => {
      
      if (err) return res.status(400).json({ msg : 'Error finding user' });
      if (!user) return res.status(400).json({ msg : 'User wasn\'t found' });
      
      console.log('Favoriting Jobs');
      return res.status(200).send(user.favoriteJobs);
  })

}

exports.unFavoriteJob = (req, res) => {

  email = req.body.email
  console.log(`Unfavorite Request Object Id: ${req.body._id}`);

  // find user
  // pull from favoriteJobs if the requested job's _id matches an _id from the favoriteJobs array.
   User.findOneAndUpdate(
     { email: email },
     { $pull: { favoriteJobs: req.body._id }  },
     { new : true },
     (err, user) => {
       
      if (err) return res.status(400).json({ msg : 'Error finding user' });
      if (!user) return res.status(400).json({ msg : 'User wasn\'t found' });
      
      console.log('Unfavoriting Jobs');
      return res.status(200).send(user.favoriteJobs);
     }
   )
}

let privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC803Y4OMJdZs+j\ndCncd9v28ef+3YywJIF5T78G4Lq050d4XmRQ0nSfIw91mMT+bPC7/06VDJFkOBX8\nsFSLyrsqUDzUHoEx9Cp2BDlsCv45IYTckvU9WEdiZdo5ylYOL82Im2R/qnh1vbjv\nvhD7tRdSynwcrHT6Tn+X73e9fpWQMSwZe3Ilg6niw+N3zfUP3vy0KgVjQ72VvvVS\nZuXwNdTCUqphLizFGsXx32tfGk6SuNskDFPz8mlv0Q56o1b2VD8K2eJcktPa7dhs\nRZniB6CGLmh2teQPpWQvcdT160gK0whg1MZj0gdAFEFFwghSe6AeTca+LOYhqjOP\nxflNicajAgMBAAECggEAXhToctPI9/upWjIfR2OK/AwEwSaHGh5eSmDS96zSKh+Q\nKyewyNpLVB0Gb1vaT0BdY/Yto7L64BnXzqrWvT4aKleHL1MxoP+chmfNaolBqJqM\nVdB9E38gNiU0aZXocbIcsMNn+/omgdexRPaJBLjycYRE+Y5tzGd/SGb+3LIs+AXE\niScEvFEGHIIQ83cQQLBchtM9Ci0jDg3hzPI8JLtTcmg+IDlOQy4wlatE8GvKt3Vy\nBs+uzj1oPdhgzIj3kN0iqwvlA/qdv2fNEke1C96xZQK/7mKel89gxyef7gFMpaOE\n50T3naSBEwwE354HHc6iDDXTYIYE8DmPyq/8JebHrQKBgQDpoZm5+RwCmrdI9sG7\nL5qx/YN/KjFefoop2kuaV+6Tc9Dq2W5KH/aUN8UCUpHNiLyHQ2rw340XHkujWigw\n3bFiWl2tgP6AhnDrCR75tmCbujyTvMiPm9xTf681lc4cXtTTH7AG6jnbWb/ePYPx\nOCzuvdW+5u4NIwcTvS+3ektL/QKBgQDO56qbGLmHqrR/xhLxcvlMMprgEp2eMERW\nqfbSykgLqAx3jW4ahCXGnJFIKr0Pxys73aNKjJttwY9mxMGQ4oAIeEjOwX+7dJaL\nWUo/YesVJyslHJB2bFBwm3+xVeuYBQmHS/SttHqbBKBNGVmXPEGP69r4K4dzA+za\nvkuNVALPHwKBgQCDJ8Q8Adu2npJcNKJnaf8HAtGqNs6GRLVdb33XxJtbTb4vySZA\nGJd9d51yg1X0s1la+f70ABudqdU+e+NqI1psY1yJhYvaLR8A4xrvhnHPmopdSbKx\n5AaZHWoHw/R0OsxxRS21hBI80LKEmbYTWbznvcxbohprZ4mWjDNYZiAVJQKBgQCh\n5dKwU7Nw/dkJFiNifNWnkv1vEgH1cs02hv4UyKWBQXin36nk47xvYbmon5CalP02\ndeI9BjLkug2Mm67ewOzwM7a82doqAzt9RFv9po/9WE3BV02O7Igw5OwRBis4I9Dl\n5kBJ36wEOqV4Trq0xTiD9ki74cu16r9eFoMlzjP4fwKBgEKfkenPX1qRFfltQhkh\n0+THdV5d07oQ2Om7zlfrFkhuy1365+vWXweGKnssoy4hppTRwZHxoQ8yWz4wn4q0\nkA4h6wd4gL68Ep3yfHCDIgNvJvqsmekFLU9jitOLSQcAfEqRI+YAdpl3QDvAFz2h\na5ARENBovPmLFiVO7vIOoEfa\n-----END PRIVATE KEY-----\n'

exports.sendEmailApplication = (req, res) => {
  var fyfLogo = "https://find-your-future.s3.us-east-2.amazonaws.com/app-logo/fyf-logo-2.png";
  var user = req.body.user;
  var profilePicture = req.body.profilePicture;
  var resume = req.body.resume;
  var age = req.body.age;
  var phoneNumber = req.body.phoneNumber;
  var reason = req.body.reason;
  var jobTitle = req.body.jobTitle;
  var jobCompanyEmail = req.body.jobCompanyEmail;

  console.log(req.body);
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
  to: `${jobCompanyEmail}`, // list of receivers
  subject: `Find Your Future User ${user.fullName} Has Applied for your Position of ${jobTitle}`,
  html: `
  <img style="width: 200px; margin: 20px 0 20px" src="${fyfLogo}" /><br/>
  <img style="width: 120px; margin-top: 10px; border-radius: 100px" src= ${profilePicture} /><br/>
  <h3>${user.fullName} has applied for the job of ${jobTitle}.</h3>
  <p>Age: ${age}</p>
  <p>Gender: <span style="text-transform: capitalize;">${user.gender}</span></p>
  <p>School: ${user.school}</p>
  <p>Grade: ${user.grade}</p>
  <p>Email: ${user.email}</p>
  <p>Phone Number: ${phoneNumber}</p><br/>
  <p>Reason:<br/><span style="white-space: pre-wrap">${reason ? reason : 'N/A'}</span></p>
  <h3>Resume</h3>
  <a href=${resume}>Link to Resume</a>
  `,

};

 transporter.sendMail(mailOptions, function (err, info) {
  if(err) {
    console.log(err);
    return res.status(400).json(err)
  }
  else {
    console.log(info);
    console.log('Applied for Job');
    return res.json('Applied for Job').status(200);
  }
});
}