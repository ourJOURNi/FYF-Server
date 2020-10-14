const Fair = require('../../models/fairs.model');

exports.getFairs = (req, res) => {
  Fair.find( (err, fairs) => {
    if (err) return res.status(400).send('Error finding fairs');
    console.log('Getting Fairs...');
    return res.status(200).send(fairs);
  })
}

exports.getFair = (req, res) => {

  Fair.find( (err, fair) => {
    if (err) return res.status(400).send('Error finding fairs');
    // console.log(fair);
    let students = fair[0].students;
    let partners = fair[0].partners;
    let chaperones = fair[0].chaperones;
    let volunteers = fair[0].volunteers;

    const schools = [
      'Martin Luther King High School',
      'Cass Technical High School',
      'Renaissance High School'
    ];
    studentsBySchool = [];
    chaperonesBySchool = [];

    // Create a new array for each school. Each school is an array of student objects.
    for (const school of schools) {
      let schoolArray = new Array();
      schoolArray.push({name: school})

      for (const student of students) {
        if (student.school === school) {
          // console.log(student);
          schoolArray.push(student)
        }
      }
      studentsBySchool.push(schoolArray);
    }
    
    // Chaperones by School
    for (const school of schools) {
      let chaperoneArray = new Array();
      chaperoneArray.push({name: school})

      for (const chaperone of chaperones) {
        if (chaperone.school === school) {
          // console.log(student);
          chaperoneArray.push(chaperone)
        }
      }
      chaperonesBySchool.push(chaperoneArray);
    }

    console.log('High schools & Number of students\n');
    for (const schools of studentsBySchool) {

      console.log(schools[0].name);
      console.log(schools.length - 1);
      console.log('\n');
    }

    // Push each array into studentsBySchool

    console.log('# of Students Total: ' + students.length + '\n');
    // console.log(studentsBySchool);
    return res.status(200).json({
      fair: fair,
      studentsBySchool: studentsBySchool,
      chaperonesBySchool: chaperonesBySchool
    });
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