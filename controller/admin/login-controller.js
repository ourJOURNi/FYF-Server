const Admin = require('../../models/admin.model');

exports.registerAdmin = (req, res) => {
  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ 'msg': 'You need to send username and password' });
  }

  Admin.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
        return res.status(400).json({ 'msg': err });
    }

    if (user) {
        return res.status(400).json({ 'msg': 'The user already exists' });
    }

    let newAdmin = Admin(req.body);
    newAdmin.save((err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': 'err' });
        }
        console.log('Saved?')
        return res.status(201).json(user);
    });
});
}

exports.loginAdmin = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({ 'msg': 'You need to send email and password' });
}

Admin.findOne({ username: req.body.username }, (err, admin) => {
    if (err) {
        return res.status(400).send({ 'msg': err });
    }

    if (!admin) {
        return res.status(400).json({ 'msg': 'The admin does not exist' });
    }
    admin.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
            console.log('Logged in as: ' + admin.username);
            res.status(200).json({ msg: 'Logged in'});
        } else {
            return res.status(400).json({ msg: 'The email and password don\'t match.' });
        }
    });
});
}

exports.logoutAdmin = (req, res) => {

}