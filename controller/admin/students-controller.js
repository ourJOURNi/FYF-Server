// Student Controller would need the User Model
const User = require('../../models/user.model');

exports.getUsers = (req, res) => {

  User.find((err, users) => {
    if (err) {
      return res.status(400).json(err);
    }

    if (!users) {
      return res.status(400).json('There were no users');
    }

    return res.send(users);
  });
}

exports.findUser = (req, res) => {
  console.log(req);
  User.findOne( {email: req.body.email} ,(err, user) => {
    if (err) {
      return res.status(400).json(err);
    }

    if (!user) {
      return res.status(400).json('There were no users with that email');
    }

    return res.send(user);
  });
}

exports.deleteUser = (req, res) => {

  User.findByIdAndDelete( req.params.id, (err) => {
    if (err) return err;
  });

  console.log(req.params.id + 'Student deleted')
  res.status(200).json(req.params.id + 'Student deleted');
}

exports.editUser = (req, res) => {

  if ( !req.body.fullName || !req.body.addressOne || !req.body.addressTwo || !req.body.phone || !req.body.city || !req.body.state || !req.body.zip || !req.body.gender || !req.body.dob || !req.body.school || !req.body.grade || !req.body.email) {
    return res.status(400).send('Please enter a title, company name, company email, summary, full job description, rate of pay, and date created. You are missing one or more fields.');
  }

  let updatedUser = req.body;
  let condition = { _id: req.body.id };

  User.updateOne(condition, updatedUser, (err, job) => {
    if ( err ) {
      return res.status(400).send('There was an error updating the student in the database: \n\n' + err);
    }

    console.log('Updated Student: ' + job);
    return res.status(200).send(job);
    }
  )
}