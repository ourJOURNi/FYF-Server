const Fair = require('../models/fairs.model');
const FairStudent = require('../models/fair-student.model');
const FairChaperone = require('../models/fair-chaperone.model');
const FairPartner = require('../models/fair-partner.model');
const FairVolunteer = require('../models/fair-volunteer.model');
const nodemailer = require('nodemailer');
const format = require('date-fns/format');
const { verify } = require('jsonwebtoken');


// Email Logic

// Set transport service which will send the emails
var partnerEmail =  nodemailer.createTransport({
  service: 'gmail',
  auth: {
        user: 'eddielacrosse2@gmail.com',
        pass: 'taliaferro2'
    },
    // debug: true, // show debug output
    // logger: true // log information in console
});

var studentEmail =  nodemailer.createTransport({
  service: 'gmail',
  auth: {
        user: 'eddielacrosse2@gmail.com',
        pass: 'taliaferro2'
    },
    // debug: true, // show debug output
    // logger: true // log information in console
});

var chaperoneEmail =  nodemailer.createTransport({
  service: 'gmail',
  auth: {
        user: 'eddielacrosse2@gmail.com',
        pass: 'taliaferro2'
    },
    // debug: true, // show debug output
    // logger: true // log information in console
});

var volunteerEmail =  nodemailer.createTransport({
  service: 'gmail',
  auth: {
        user: 'eddielacrosse2@gmail.com',
        pass: 'taliaferro2'
    },
    // debug: true, // show debug output
    // logger: true // log information in console
});
//  configuration for email details


exports.getFairs = (req, res) => {
  Fair.find( (err, fairs) => {
    if (err) return res.status(400).send('Error finding fairs');
    return res.status(200).send(fairs);
  })
}

exports.getFair = (req, res) => {

  let name = req.body.name;
  console.log('Fairs Controller: ')
  console.log(name);

  Fair.findOne(
    {title: name},
    (err, fair) => {
    if (err) return res.status(400).json('Error finding fair');
    if (!fair) return res.status(400).json({msg: 'There were no fairs with that name'})
    return res.status(200).json(fair);
  })
}

exports.registerStudent = (req, res) => {
  id = req.body.id
  name = req.body.name
  email = req.body.email,
  school = req.body.school,
  grade = req.body.grade,
  phone = req.body.phone,
  gender = req.body.gender,
  lunch = req.body.lunch,
  interests = req.body.interests,
  questionOne = req.body.question1,
  questionTwo = req.body.question2,
  questionThree = req.body.question3,
  questionFour = req.body.question4,
  questionFive = req.body.question5

  let student = {
    name,
    email,
    school,
    grade,
    phone,
    gender,
    lunch,
    interests,
    question1: questionOne,
    question2: questionTwo,
    question3: questionThree,
    question4: questionFour,
    question5: questionFive,
    dateRegistered: format(Date.now(), 'MMMM dd, yyyy'),
    timeRegistered: format(Date.now(), 'hh:mm a')
  }

  let fairStudent = FairStudent(student)

  Fair.findById(
    id,
    (err, fair) => {
    if (err) return res.status(400).send('Error finding fair');

    let fairStudents = Object.values(fair.students);

    console.log('student email');
    console.log(student.email);
    let studentFound = false;

    // Search for any matching email addresses for students that have already resigtered for the fair.

    // for(let i = 0; i < fairStudents.length; i++) {

    //     // If User enters an email that has already been registered.
    //     if ( fairStudents[i].email === student.email) {
    //       console.log('A Student already has that email address')
    //       // An Error Validation Message would go nice here. Toast? Alert?
    //       return res.status(401).json('A Student already has that email address');
    //     }
    // }

    // Divide students into seperate arrays based on their school
    let studentsInSchool = []
    for (let s of fairStudents) {
      if (student.school === s.school) {
        studentsInSchool.push(s.school);
      }
    }

    console.log(studentsInSchool.length);
    console.log(studentsInSchool);

    if (studentsInSchool.length >= 30) {
      console.log('There are more than 30 students registered at this high school');

      this.studentsInSchool = [];
      fairStudent.waitlisted = true;

      res.status(401).json('There are more than 30 students registered from your school');
      // Update Fair with Student if Email address is Valid
      Fair.findOneAndUpdate(
      {_id: id},
      { $push:
        { students: fairStudent} },
       (err, fair) => {

      if (err) return res.status(400).send('Error finding fairs');

      // await console.log( fair);

      fairDate = format(fair.date, 'MMMM dd, yyyy'),
      fairTime = format(fair.date, 'hh:mm a')

      const studentMailWaitlistOptions = {
        from: 'eddielacrosse2@gmail.com', // sender address
        to: `${email}`, // list of receivers
        subject: `You have been waitlisted for ${fair.title}`,
        html: `
        <h3>Hi ${student.name}!<br>
        You have been waitlisted as a Student for ${fair.title} on the date of ${student.dateRegistered} at ${student.timeRegistered}.</h3>
        <br>
        <h1>Fair Details</h1>
        <h3 style="color: #999;"> Date: ${fairDate}</h3>
        <h3 style="color: #999;"> Time: ${fairTime}</h3>
        <p>${fair.summary}</p>
        <p>Title: ${fair.title}</p>
        <p>Address: ${fair.address}</p>
        <p>City: ${fair.city}</p>
        <p>State: ${fair.state}</p>
        <p>Zip: ${fair.zip}</p>
        <p>${fair.studentDescription}</p>

        <h1 style="margin-top: 100px;">${student.name}'s Details</h1>
        <p>Email: ${student.email}</p>
        <p>School: ${student.school}</p>
        <p>Phone: ${student.phone}</p>
        <p>Gender: ${student.gender}</p>
        <p>Lunch: ${student.lunch}</p>

        <p>Interests: ${student.interests}</p>
        <p>Question 1: ${student.question1.question}</p>
        <p>Answer: ${student.question1.answer}</p>
        <p>Question 2: ${student.question2.question}</p>
        <p>Answer: ${student.question2.answer}</p>
        <p>Question 3: ${student.question3.question}</p>
        <p>Answer: ${student.question3.answer}</p>
        <p>Question 4: ${student.question4.question}</p>
        <p>Answer: ${student.question4.answer}</p>
        <p>Question 5: ${student.question5.question}</p>
        <p>Answer: ${student.question5.answer}</p>

        <hr>
        <p>If you need to change any of this information, please send an email to [enter email here] </p>
        `
      }

      studentEmail.sendMail(studentMailWaitlistOptions, function (err, info) {
        if(err)
          console.log(err)
        else {
          console.log(info);
          return  res.status(200).json(fair);
        }
      });

    });

    } else {
      console.log('There are LESS than 30 students registered at ' + student.school);

      this.studentsInSchool = [];

      Fair.findOneAndUpdate(
        {_id: id},
        { $push:
          { students: fairStudent} },
         (err, fair) => {

        if (err) return res.status(400).send('Error finding fairs');

        // await console.log( fair);

        fairDate = format(fair.date, 'MMMM dd, yyyy'),
        fairTime = format(fair.date, 'hh:mm a')

        const studentMailOptions = {
          from: 'eddielacrosse2@gmail.com', // sender address
          to: `${email}`, // list of receivers
          subject: `You have been registered for ${fair.title}`,
          html: `
          <h3>Hi ${student.name}!<br>
          You have been waitlisted as a Student for ${fair.title} on the date of ${student.dateRegistered} at ${student.timeRegistered}.</h3>
          <br>
          <h1>Fair Details</h1>
          <h3 style="color: #999;"> Date: ${fairDate}</h3>
          <h3 style="color: #999;"> Time: ${fairTime}</h3>
          <p>${fair.summary}</p>
          <p>Title: ${fair.title}</p>
          <p>Address: ${fair.address}</p>
          <p>City: ${fair.city}</p>
          <p>State: ${fair.state}</p>
          <p>Zip: ${fair.zip}</p>
          <p>${fair.description}</p>

          <h1 style="margin-top: 100px;">${student.name}'s Details</h1>
          <p>Email: ${student.email}</p>
          <p>School: ${student.school}</p>
          <p>Phone: ${student.phone}</p>
          <p>Gender: ${student.gender}</p>
          <p>Lunch: ${student.lunch}</p>

          <p>Email: ${student.email}</p>
          <p>School: ${student.school}</p>
          <p>Phone: ${student.phone}</p>
          <p>Gender: ${student.gender}</p>
          <p>Lunch: ${student.lunch}</p>

          <hr>
          <p>If you need to change any of this information, please send an email to [enter email here] </p>
          `
        }

        studentEmail.sendMail(studentMailOptions, function (err, info) {
          if(err)
            console.log(err)
          else {
            console.log(info);
            return  res.status(200).json(fair);

          }
        });
      });
    }
  });
}

exports.registerChaperone = (req, res) => {
  id = req.body.id
  name = req.body.name
  email = req.body.email,
  school = req.body.school,
  phone = req.body.phone,
  gender = req.body.gender,
  lunch = req.body.lunch,
  console.log(req.body);

  let chaperone = {
    name,
    email,
    school,
    phone,
    gender,
    lunch,
    dateRegistered: format(Date.now(), 'MMMM dd, yyyy'),
    timeRegistered: format(Date.now(), 'hh:mm a')
  }

  let fairChaperone = FairChaperone(chaperone)

  

  Fair.findOneAndUpdate(
    {_id: id},
    { $push: { chaperones: fairChaperone} },
    async (err, fair) => {

      let fairChaperones = Object.values(fair.chaperones);

      // Saerch for any matching email addresses
      for(let i = 0; i < fairChaperones.length; i++) {
        fairChaperones
      // If User enters an email that has already been registered.
      if ( fairChaperones[i].email === chaperone.email) {
        console.log('A Chaperone already has that email address')
        // An Error Validation Message would go nice here. Toast? Alert?
        return res.status(401).json('A Chaperone already has that email address');
      }
    }

    if (err) return await res.status(400).send('Error finding fairs');

    await console.log( fair);

    fairDate = format(fair.date, 'MMMM dd, yyyy'),
    fairTime = format(fair.date, 'hh:mm a')

    const chaperoneMailOptions = {
      from: 'eddielacrosse2@gmail.com', // sender address
      to: `${chaperone.email}`, // list of receivers
      subject: `You have registered for ${fair.title} - United Way Southeast Michigan`,
      html: `
      <h3>Hi ${chaperone.name}!<br>
      You have registered as a Chaperone for ${fair.title} on the date of ${chaperone.dateRegistered} at ${chaperone.timeRegistered}.</h3>
      <br>

      <h1>Fair Details</h1>
      <h3 style="color: #999;"> Date: ${fairDate}</h3>
      <h3 style="color: #999;"> Time: ${fairTime}</h3>
      <p>${fair.summary}</p>
      <p>Title: ${fair.title}</p>
      <p>Address: ${fair.address}</p>
      <p>City: ${fair.city}</p>
      <p>State: ${fair.state}</p>
      <p>Zip: ${fair.zip}</p>
      <p>${fair.description}</p>

      <h1 style="margin-top: 100px;">${chaperone.name}'s Details</h1>
      <p>Email: ${chaperone.email}</p>
      <p>School: ${chaperone.school}</p>
      <p>Phone: ${chaperone.phone}</p>
      <p>Lunch: ${chaperone.lunch}</p>

      <hr>
      <p>If you need to change any of this information, please send an email to [enter email here] </p>
      `
    };

    await chaperoneEmail.sendMail(chaperoneMailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
    });

    return await res.status(200).json(fair);
  })

}

exports.registerPartner = (req, res) => {

  id = req.body.id
  name = req.body.name
  email = req.body.email,
  organization = req.body.organization,
  phone = req.body.phone,
  logo = req.body.logo,
  description = req.body.description,
  gender = req.body.gender,
  colleagues = req.body.colleagues,
  lunch = req.body.lunch,
  verified = false,
  console.log(req.body);

  let partner = {
    name,
    email,
    organization,
    phone,
    logo,
    gender,
    lunch,
    colleagues,
    description,
    verified,
    dateRegistered: format(Date.now(), 'MMMM dd, yyyy'),
    timeRegistered: format(Date.now(), 'hh:mm a')
  }

  let fairPartner = FairPartner(partner)

  Fair.findOneAndUpdate(
    {_id: id},
    { $push: { partners: fairPartner} },
    async (err, fair) => {

      let fairPartners = Object.values(fair.partners);

      // Saerch for any matching email addresses
      for(let i = 0; i < fairPartners.length; i++) {
        fairPartners
      // If User enters an email that has already been registered.
      if ( fairPartners[i].email === partner.email) {
        console.log('A Partner already has that email address')
        // An Error Validation Message would go nice here. Toast? Alert?
        return res.status(401).json('A Partner already has that email address');
      }
    }

    if (err) return await res.status(400).send('Error finding partners');

    if (!fair) return await res.status(400).send('There were no partners with that id');

    await console.log(fair);

    fairDate = format(fair.date, 'MMMM dd, yyyy'),
    fairTime = format(fair.date, 'hh:mm a')

    const partnerMailOptions = {
      from: 'eddielacrosse2@gmail.com', // sender address
      to: `${partner.email}`, // list of receivers
      subject: `You have registered for ${fair.title}`,
      html: `
      <h3>Hi ${partner.name}!<br>
      You have registered as a Partner for ${fair.title} on the date of ${partner.dateRegistered} at ${partner.timeRegistered}.</h3>
      <br>

      <h1>Fair Details</h1>
      <h3 style="color: #999;"> Date: ${fairDate}</h3>
      <h3 style="color: #999;"> Time: ${fairTime}</h3>
      <p>${fair.summary}</p>
      <p>Title: ${fair.title}</p>
      <p>Address: ${fair.address}</p>
      <p>City: ${fair.city}</p>
      <p>State: ${fair.state}</p>
      <p>Zip: ${fair.zip}</p>
      <p>${fair.description}</p>

      <h1 style="margin-top: 100px;">${partner.name}'s Details</h1>
      <p>Email: ${partner.email}</p>
      <p>Company: ${partner.company}</p>
      <p>Phone: ${partner.phone}</p>
      <p>Colleagues: ${partner.colleagues}</p>
      <p>Logo: ${partner.logo}</p>

      <hr>
      <p>If you need to change any of this information, please send an email to [enter email here] </p>
      `
    }

    await partnerEmail.sendMail(partnerMailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
    });
    return await res.status(200).json(partner);
  })
}

exports.registerVolunteer = (req, res) => {

  let id = req.body.id
  let date = Date.now();

  let volunteer = {
    name: req.body.name,
    email: req.body.email,
    date: format(date, 'MMMM dd, yyyy')
  }

  let fairVolunteer = FairVolunteer(volunteer);

  Fair.findOneAndUpdate(
    {_id: id},
    { $push: { volunteers: fairVolunteer} },
    async (err, fair) => {

    if (err) return await res.status(400).send('Error finding volunteers');

    if (!volunteer) return await res.status(400).send('There were no volunteers with that id');

    await console.log(fair);


    const volunteerMailOptions = {
      from: 'eddielacrosse2@gmail.com', // sender address
      to: `${volunteer.email}`, // list of receivers
      subject: `You have started registering for ${fair.title} as a Volunteer.`,
      html: `
      <h3>Hi ${volunteer.name}!<br>

      <p>Additional Message goes here</p>

      <a href="www.google.com">Link goes here</a>
      <br>
      `
    }

    await volunteerEmail.sendMail(volunteerMailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
    });

    return await res.status(200).json(fair);
  }
  )




}