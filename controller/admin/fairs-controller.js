const Fair = require('../../models/fairs.model');


exports.getFairs = (req, res) => {
  Fair.find( (err, fairs) => {
    if (err) return res.status(400).send('Error finding fairs');
    console.log('Getting Fairs...');
    return res.status(200).send(fairs);
  })
}

exports.getFair = (req, res) => {
  // console.log(req.body);
  id = req.body._id;
  console.log('Getting fair info...');
  
  Fair.findById(
    id,
    (err, fair) => {
    if (err) return res.status(400).send('Error finding fairs');
    let students = fair.students;
    let partners = fair.partners;
    let chaperones = fair.chaperones;
    let volunteers = fair.volunteers;

    // List of Schools
    // Will need to be updated manually to add a school to the
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

exports.deleteStudentAgendaItem = (req, res) => {
  console.log('Deleting Student Agenda Item... \n');
  let id = req.body.fairId;
  let itemIndex = req.body.index;

  Fair.updateOne(
    {_id: id},
    {$unset: {['studentAgenda.' + itemIndex]: 1}},
    (err, fair) => {
      Fair.updateOne(
        {_id: id},
        {$pull: {'studentAgenda': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair)
          }
        })
    })
  }

exports.deleteChaperoneAgendaItem = (req, res) => {
  console.log('Deleting Chaperone Agenda Item... \n');
  console.log(req.body);

}

exports.deleteVolunteerAgendaItem = (req, res) => {
  console.log('Deleting Volunteer Agenda Item... \n');
  console.log(req.body);

}

exports.deletePartnerAgendaItem = (req, res) => {
  console.log('Deleting Partner Agenda Item... \n');
  console.log(req.body);

}

exports.updateFair = (req, res) => {
  let date = req.body.date;
  let time = req.body.time;
  let isoDate = new Date(date + " " + time);

  delete req.body.time;
  req.body.date = isoDate;

  console.log(req.body);
  console.log(date);
  console.log(time);
  console.log(isoDate);

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

exports.printStudents = (req, res) => {

}