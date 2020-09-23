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

exports.sendEmailApplication = (req, res) => {
  var user = req.body.user;
  var age = req.body.age;
  var phoneNumber = req.body.phoneNumber;
  var reason = req.body.reason;
  var jobTitle = req.body.jobTitle;
  var jobCompanyEmail = req.body.jobCompanyEmail;

  console.log(user);
  console.log(jobCompanyEmail);
  // Set transport service which will send the emails
  var transporter =  nodemailer.createTransport({
    service: 'Gmail',
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
  to: `${jobCompanyEmail}`, // list of receivers
  subject: `Find Your Future User ${user.fullName} Has Applied for your Position of ${jobTitle}`,
  html: `
  <img style="width: 100px; margin: 20px 0 20px" src="cid:unique@logo.ee" /><br/>
  <img style="width: 120px; margin-top: 10px; border-radius: 100px" src="cid:unique@profile.ee" /><br/>
  <h3>${user.fullName} has applied for the job of ${jobTitle}.</h3>
  <p>Age: ${age}</p>
  <p>Gender: <span style="text-transform: capitalize;">${user.gender}</span></p>
  <p>Address: ${user.addressOne}, ${user.addressTwo}, ${user.city}, ${user.state}, ${user.zip}</p>
  <p>School: ${user.school}</p>
  <p>Grade: ${user.grade}</p>
  <p>Email: ${user.email}</p>
  <p>Phone Number: ${phoneNumber}</p><br/>
  <p>Reason:<br/><span style="white-space: pre-wrap">${reason ? reason : 'N/A'}</span></p>
  <h3>This applicant's resume, if any, is attached to this message.</h3>
  `,
  attachments: [
    {
      filename: 'fyf-logo-2.png',
      path: './assets/fyf-logo-2.png',
      cid: 'unique@logo.ee'
    },
    {
      filename: `${user.fullName}'s Profile Picture.jpg`,
      path: `${user.profilePicture}`,
      cid: 'unique@profile.ee'
    },
    {
      filename: `${user.fullName}'s Resume.pdf`,
      path: `${user.resume}`,
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

  console.log('Applied for Job');
  res.json('Applied for Job').status(200);
}