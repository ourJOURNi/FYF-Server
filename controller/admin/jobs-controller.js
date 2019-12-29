const Job = require('../../models/job.model');

exports.getJobs = (req, res) => {
  console.log('Getting all Jobs');

  Job.find((err, jobs) => {
    if (err) return res.status(400).send('Error finding jobs');
    return res.send(jobs);
  });
}

exports.addJob = (req, res) => {

  if ( !req.body.title || !req.body.companyName || !req.body.summary || !req.body.fullJobDescription || !req.body.rateOfPay ) {
    return res.status(400).send('Please enter a title, company name, summary, full job description, and rate of pay. You are missing one or more fields.');
  }

  let newJob = Job(req.body);

  newJob.save( (err, job) => {
    if ( err ) {
      return res.status(400).send('There was an error saving the job to the database: \n\n' + err);
    }
    console.log('Added Job: ' + job);
    return res.status(200).send(job);
  })
}

exports.deleteJob = (req, res) => {
  console.log('Deleting Job');

  Job.deleteOne( {_id: req.body._id}, (err) => {
    if (err) return err;
  } );
  console.log(req.body._id + 'Job deleted');
  res.status(200).send(req.body._id + 'Job deleted');
}