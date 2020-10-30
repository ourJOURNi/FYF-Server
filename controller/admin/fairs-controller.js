const { json } = require('express');
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


exports.addStudentAgendaItem = (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let time = req.body.time;
  console.log('Attempting to add Student Agenda Item ...\n');
  console.log(id);
  console.log(title);
  console.log(time);
  Fair.findOneAndUpdate(
    { _id: id },
    { $push: { 'studentAgenda': { title: title, time: time } } },
    { new: true },
    (err, fair) => {
      if (err) return err;
      if (!fair) return json({ msg: 'No fair with that ID' });
      if (fair) return res.status(200).json(fair.studentAgenda);
    });
}

exports.deleteStudentAgendaItem = (req, res) => {
  console.log('Deleting Student Agenda Item... \n');
  let id = req.body.fairId;
  let itemIndex = req.body.index;

  Fair.findOneAndUpdate(
    {_id: id},
    {$unset: {['studentAgenda.' + itemIndex]: 1}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'studentAgenda': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair.volunteers);
            return res.status(200).json(fair.volunteers)
          }
        })
    })
}

exports.editStudentAgendaItem = (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let time = req.body.time;
  let itemIndex = req.body.index;
  console.log('Attempting to edit Student Agenda Item ...\n');
  console.log(id);
  console.log(title);
  console.log(time);
  console.log(itemIndex);

  Fair.findOneAndUpdate(
    {_id: id},
    {$set: {['studentAgenda.' + itemIndex]: { title: title, time: time }}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
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
            return res.status(200).json(fair.studentAgenda)
          }
        })
    })
}


exports.addChaperoneAgendaItem = (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let time = req.body.time;
  console.log('Attempting to add Chaperone Agenda Item ...\n');
  console.log(id);
  console.log(title);
  console.log(time);
  Fair.findOneAndUpdate(
    { _id: id },
    { $push: { 'chaperoneAgenda': { title: title, time: time } } },
    { new: true },
    (err, fair) => {
      if (err) return err;
      if (!fair) return json({ msg: 'No fair with that ID' });
      if (fair) return res.status(200).json(fair.chaperoneAgenda);
    });
}

exports.deleteChaperoneAgendaItem = (req, res) => {
  console.log('Deleting Chaperone Agenda Item... \n');
  let id = req.body.fairId;
  let itemIndex = req.body.index;

  Fair.findOneAndUpdate(
    {_id: id},
    {$unset: {['chaperoneAgenda.' + itemIndex]: 1}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'chaperoneAgenda': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair.studentAgenda)
          }
        })
    })

}

exports.editChaperoneAgendaItem = (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let time = req.body.time;
  let itemIndex = req.body.index;
  console.log('Attempting to edit Chaperone Agenda Item ...\n');
  console.log(id);
  console.log(title);
  console.log(time);
  console.log(itemIndex);

  Fair.findOneAndUpdate(
    {_id: id},
    {$set: {['chaperoneAgenda.' + itemIndex]: { title: title, time: time }}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'chaperoneAgenda': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair.chaperoneAgenda)
          }
        })
    })
}

exports.addVolunteer = (req, res) => {
  console.log('Attempting to ADD a volunteer');
  let id = req.body.id;
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;

  Fair.findByIdAndUpdate(
    id,
    { $push: { 'volunteers': {
      name: name,
      email: email,
      phone: phone
    }}},
    { new: true},
    (err, fair) => {
      if (err) return err;
      if (!fair) return res.status(200).json({msg: 'there were no fairs with that id'});
      if (fair) return res.status(200).json(fair['volunteers']);
    }
  )
}

exports.editVolunteer = (req, res) => {
  console.log('Attempting to EDIT a volunteer');
  let id = req.body.id;
  let index = req.body.index;
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;

  Fair.findOneAndUpdate(
    {_id: id},
    {$set: {['volunteers.' + index]: {
      name: name,
      email: email,
      phone: phone }}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'volunteers': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            return res.status(200).json(fair.volunteers)
          }
        })
    })
}

exports.deleteVolunteer = (req, res) => {
  console.log('Attempting to DELETE a volunteer');
  console.log(req.body);
  
  let id = req.body.id;
  let index = req.body.index;

  Fair.findByIdAndUpdate(
    id,
    { $unset: {['volunteers.' + index]: 1}},
    { new: true},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'volunteers': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            return res.status(200).json(fair.volunteers)
          }
        })
    }
  )
}

exports.addVolunteerAgendaItem = (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let time = req.body.time;
  console.log('Attempting to add Volunteer Agenda Item ...\n');
  console.log(id);
  console.log(title);
  console.log(time);
  Fair.findOneAndUpdate(
    { _id: id },
    { $push: { 'volunteerAgenda': { title: title, time: time } } },
    { new: true },
    (err, fair) => {
      if (err) return err;
      if (!fair) return json({ msg: 'No fair with that ID' });
      if (fair) return res.status(200).json(fair.volunteerAgenda);
    });
}

exports.deleteVolunteerAgendaItem = (req, res) => {
  console.log('Deleting Volunteer Agenda Item... \n');
  let id = req.body.fairId;
  let itemIndex = req.body.index;

  Fair.findOneAndUpdate(
    {_id: id},
    {$unset: {['volunteerAgenda.' + itemIndex]: 1}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'volunteerAgenda': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair.volunteerAgenda)
          }
        })
    })

}

exports.editVolunteerAgendaItem = (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let time = req.body.time;
  let itemIndex = req.body.index;
  console.log('Attempting to edit Volunteer Agenda Item ...\n');
  console.log(id);
  console.log(title);
  console.log(time);
  console.log(itemIndex);

  Fair.findOneAndUpdate(
    {_id: id},
    {$set: {['volunteerAgenda.' + itemIndex]: { title: title, time: time }}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'volunteerAgenda': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair.volunteerAgenda)
          }
        })
    })
}

exports.deleteVolunteerFAQ = (req, res) => {
  let id = req.body.fairId;
  let itemIndex = req.body.index;

  Fair.findOneAndUpdate(
    {_id: id},
    {$unset: {['volunteerFAQ.' + itemIndex]: 1}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'volunteerFAQ': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair.volunteerFAQ)
          }
        })
    })
}

exports.editVolunteerFAQ = (req, res) => {
  let id = req.body.id;
  let index = req.body.index;
  let question = req.body.question;
  let answer = req.body.answer;
  console.log('Attempting to edit Volunteer FAQ ...\n');
  console.log(id);
  console.log(index);
  console.log(question);
  console.log(answer);

  Fair.findOneAndUpdate(
    {_id: id},
    {$set: {['volunteerFAQ.' + index]: { question: question, answer: answer }}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'volunteerFAQ': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair.volunteerFAQ)
          }
        })
    })
}

exports.addVolunteerFAQ = (req, res) => {
  let id = req.body.id;
  let question = req.body.question;
  let answer = req.body.answer;
  console.log('Attempting to add Volunteer Agenda Item ...\n');
  console.log(id);
  console.log(question);
  console.log(answer);
  Fair.findOneAndUpdate(
    { _id: id },
    { $push: { 'volunteerFAQ': { question: question, answer: answer } } },
    { new: true },
    (err, fair) => {
      if (err) return err;
      if (!fair) return json({ msg: 'No fair with that ID' });
      if (fair) return res.status(200).json(fair.volunteerFAQ);
    });
}


exports.addPartnerAgendaItem = (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let time = req.body.time;
  console.log('Attempting to add Partner Agenda Item ...\n');
  console.log(id);
  console.log(title);
  console.log(time);
  Fair.findOneAndUpdate(
    { _id: id },
    { $push: { 'partnerAgenda': { title: title, time: time } } },
    { new: true },
    (err, fair) => {
      if (err) return err;
      if (!fair) return json({ msg: 'No fair with that ID' });
      if (fair) return res.status(200).json(fair.partnerAgenda);
    });
}

exports.deletePartnerAgendaItem = (req, res) => {
  console.log('Deleting Partner Agenda Item... \n');
  let id = req.body.fairId;
  let itemIndex = req.body.index;

  Fair.findOneAndUpdate(
    {_id: id},
    {$unset: {['partnerAgenda.' + itemIndex]: 1}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'partnerAgenda': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair.partnerAgenda)
          }
        })
    })
}

exports.editPartnerAgendaItem = (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let time = req.body.time;
  let itemIndex = req.body.index;
  console.log('Attempting to edit Partner Agenda Item ...\n');
  console.log(id);
  console.log(title);
  console.log(time);
  console.log(itemIndex);

  Fair.findOneAndUpdate(
    {_id: id},
    {$set: {['partnerAgenda.' + itemIndex]: { title: title, time: time }}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'partnerAgenda': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair.partnerAgenda)
          }
        })
    })
}

exports.deletePartnerFAQ = (req, res) => {
  let id = req.body.fairId;
  let itemIndex = req.body.index;

  Fair.findOneAndUpdate(
    {_id: id},
    {$unset: {['partnerFAQ.' + itemIndex]: 1}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'partnerFAQ': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair.partnerFAQ)
          }
        })
    })
}

exports.editPartnerFAQ = (req, res) => {
  let id = req.body.id;
  let index = req.body.index;
  let question = req.body.question;
  let answer = req.body.answer;
  console.log('Attempting to edit Partner FAQ ...\n');
  console.log(id);
  console.log(index);
  console.log(question);
  console.log(answer);

  Fair.findOneAndUpdate(
    {_id: id},
    {$set: {['partnerFAQ.' + index]: { question: question, answer: answer }}},
    (err, fair) => {
      Fair.findByIdAndUpdate(
        {_id: id},
        {$pull: {'partnerFAQ': null}},
        {new: true},
        (err, fair) => {
          if (err) return err;
          if (!fair) {
            return res.status(400).json({msg: 'No Fair with that ID'})
          }
          if (fair) {
            console.log(fair);
            return res.status(200).json(fair.partnerFAQ)
          }
        })
    })
}

exports.addPartnerFAQ = (req, res) => {
  let id = req.body.id;
  let question = req.body.question;
  let answer = req.body.answer;
  console.log('Attempting to add Partner Agenda Item ...\n');
  console.log(id);
  console.log(question);
  console.log(answer);
  Fair.findOneAndUpdate(
    { _id: id },
    { $push: { 'partnerFAQ': { question: question, answer: answer } } },
    { new: true },
    (err, fair) => {
      if (err) return err;
      if (!fair) return json({ msg: 'No fair with that ID' });
      if (fair) return res.status(200).json(fair.partnerFAQ);
    });
}

