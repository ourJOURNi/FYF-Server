const User = require('../models/user.model');
const express = require("express");
const router = express.Router();


router.post('/does-user-exist', async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({
    msg: "User already registered with that email address.",
    exists: true
  });
  if (!user) return res.status(200).json({
    exists: false,
    email: req.body.email,
    password: req.body.password
  });
})

router.get('/', async (req, res) => {
  res.send('Made it to sign-up page');
})

router.post("/", async (req, res) => {
  // validate the request body first
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  //  ++ Add to UI that user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered with that email address.");

  user = new User({
    fullName: req.body.fullName,
    about: req.body.about,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    gender: req.body.gender,
    dob: req.body.dob,
    school: req.body.school,
    grade: req.body.grade,
    profilePicture: req.body.profilePicture,
    resume: req.body.resume,
    email: req.body.email,
    password: req.body.password,
  });

  // Hash password
  //  ++ Add Salt
  console.log('Registered User: ' + user);

  await user.save();
});

module.exports = router;