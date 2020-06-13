const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config/default.json');

function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: 200 // 86400 expires in 24 hours
      });
}

exports.registerUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ 'msg': 'You need to send email and password' });
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }

        if (user) {
            return res.status(400).json({ 'msg': 'The user already exists' });
        }

        let newUser = User(req.body);
        newUser.save((err, user) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }
            return res.status(200).json(user);
        });
    });
};

exports.doesUserExist = (req, res) => {

    if (!req.body.email ) {
        console.log('No r');
        return res.status(400).json('Request needs an email in the request')
      }

    
}




exports.loginUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ 'msg': 'You need to send email and password' });
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }

        if (!user) {
            return res.status(400).json({ 'msg': 'The user does not exist' });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                console.log('Logged in as: ' + user.email);
                res.status(200).json({
                    token: createToken(user)
                });
            } else {
                return res.status(400).json({ msg: 'The email and password don\'t match.' });
            }
        });
    });
};

exports.forgotPassword = (req, res) => {
    console.log('request');
    console.log(req.body);

    if ( !req.body.password || !req.body.newPassword) {
        res.status(400).send('Please enter an old password and a new password')
      }
}