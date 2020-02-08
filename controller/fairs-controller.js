const Fair = require('../models/fairs.model');

exports.getFairs = (req, res) => {
  Fair.find( (err, fairs) => {
    if (err) return res.status(400).send('Error finding fairs');
    return res.status(200).send(fairs);
  })
}

exports.getFair = (req, res) => {

  let id = req.body.id;
  console.log('Fairs Controller: ')
  console.log(id);

  Fair.findById( id, (err, fair) => {
    if (err) return res.status(400).send('Error finding fair');
    return res.status(200).send(fair);
  })
}