const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const User = require('../models/user.model');
const express = require("express");
const router = express.Router();

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
    addressOne: req.body.addressOne,
    addressTwo: req.body.addressTwo,
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
  user.password = await bcrypt.hash(user.password, 10);
  console.log('Registered User: ' + user);

  await user.save();
  await res.send('Posted to Database');

  // Future: Modify to encrypted token
  // Future: Add Accress, Admin Rights, ect
  // const token = user.generateAuthToken();
  // res.header("x-auth-token", token).send({
  //   _id: user._id,
  //   name: user.name,
  //   email: user.email,
  //   password: user.password,
  //   hashedPassword: user.hashedPassword,
  // }).status(200);
});

module.exports = router;