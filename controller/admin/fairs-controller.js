const Fair = require('../../models/fairs.model');

exports.getFairs = (req, res) => {
  Fair.find( (err, fairs) => {
    if (err) return res.status(400).send('Error finding fairs');
    console.log('Getting Fairs...');
    console.log(fairs);
    return res.status(200).send(fairs);
  })
}

exports.addFair = (req, res) => {
  console.log(req.body);

  let fair = {
    title: req.body.title,
    date: req.body.date,
    time: req.body.time,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    students: req.body.students,
    chaperons: req.body.chaperons,
    partners: req.body.partners,
    dateCreated: Date.now(),
    description: req.body.description,
    summary: req.body.summary
  }

  let newFair = Fair(fair);

  newFair.save( (err, fair) => {
    if ( err ) {
      return res.status(400).send('There was an error saving the fair to the database: \n\n' + err);
    }
    console.log('Added fair: ' + fair);
    return res.status(200).send(fair);
  })

}

exports.deleteFair = (req, res) => {

  Fair.findByIdAndDelete( req.params._id, (err) => {
    if (err) return err;
  } );
  console.log(req);
  console.log(req.params._id + ' Fair deleted');
  res.status(200).json(req.params._id + ' Fair deleted');
}

exports.updateFair = (req, res) => {

  if (!req.body._id  ) {
    return res.status(400).send('There was no _id in the request body');
  }

  let updatedJob = req.body;
  let condition = { _id: req.body._id };

  Fair.updateOne(
    condition,
    updatedJob,
    (err, fair) => {
    if ( err ) {
      return res.status(400).send('There was an error updating the fair in the database: \n\n' + err);
    }

    console.log('Updated Fair: ' + fair);
    return res.status(200).send(fair);
    }
  )
}