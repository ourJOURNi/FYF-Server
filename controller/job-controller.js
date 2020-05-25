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
  <img style="width: 100px; margin: 35px 0 20px" src="cid:unique@logo.ee" />
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
  res.json('Applied for Job').status(200);
}