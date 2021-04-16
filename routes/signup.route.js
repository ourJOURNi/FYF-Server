const User = require('../models/user.model');
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  // validate the request body first
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  //  ++ Add to UI that user already exists
  User.findOne({ email: req.body.email },
    (err, user) => {
      if(err) return res.status(400).json(err);
      if(user) return res.status(400).json({msg: 'there is already a user registered with that email'})
      if(!user) {
        console.log(req.body);
        let user = {
          fullName: req.body.fullName,
          about: req.body.about,
          gender: req.body.gender,
          dob: req.body.dob,
          school: req.body.school,
          grade: req.body.grade,
          profilePicture: req.body.profilePicture,
          resume: req.body.resume,
          email: req.body.email,
          password: req.body.password,
        }

        let newUser = User(user);

        newUser.save((err, user) => {
          if (err) return console.log(err);
          ;
          console.log('Attemping to save');
          console.log(user);
          
        });
      }
    });
});

module.exports = router;