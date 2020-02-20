const Fair = require('../models/fairs.model');
const FairStudent = require('../models/fair-student.model');
const FairChaperone = require('../models/fair-chaperone.model');
const FairPartner = require('../models/fair-partner.model');
const nodemailer = require('nodemailer');
const format = require('date-fns/format');


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

exports.registerStudent = (req, res) => {

  id = req.body.id
  name = req.body.name
  email = req.body.email,
  school = req.body.school,
  grade = req.body.grade,
  phone = req.body.phone,
  gender = req.body.gender,
  lunch = req.body.lunch,
  questionOne = req.body.questionOne,
  questionTwo = req.body.questionTwo,
  questionThree = req.body.questionThree,
  questionFour = req.body.questionFour,
  questionFive = req.body.questionFive,
  dateRegistered = Date.now()

  let student = {
    name,
    email,
    school,
    grade,
    phone,
    gender,
    lunch,
    questionOne,
    questionTwo,
    questionThree,
    questionFour,
    questionFive,
    dateRegistered: format(Date.now(), 'MMMM dd, yyyy'),
    timeRegistered: format(Date.now(), 'hh:mm a')
  }

  let fairStudent = FairStudent(student)

  Fair.findOneAndUpdate(
    {_id: id},
    { $push:
      { students: fairStudent} },
    async (err, fair) => {

    if (err) return await res.status(400).send('Error finding fairs');

    await console.log( fair);

    fairDate = format(fair.date, 'MMMM dd, yyyy'),
    fairTime = format(fair.date, 'hh:mm a')

    const studentMailOptions = {
      from: 'eddielacrosse2@gmail.com', // sender address
      to: `${email}`, // list of receivers
      subject: `You have registered for ${fair.title}`,
      html: `
      <h3>Hi ${student.name}!<br>
      You have registered as a Student for ${fair.title} on the date of ${student.dateRegistered} at ${student.timeRegistered}.</h3>
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

    await studentEmail.sendMail(studentMailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
    });

    return await res.status(200).json(fair);
  })
}


exports.registerChaperone = (req, res) => {
  console.log(req.body);

  let id = req.body.id

  let chaperone = {
    name: req.body.name,
    email: req.body.email,
    school: req.body.school,
    phone: req.body.phone,
    lunch: req.body.lunch,
    dateRegistered: format(Date.now(), 'MMMM dd, yyyy'),
    timeRegistered: format(Date.now(), 'hh:mm a')
  }

  let fairChaperone = FairChaperone(chaperone)

  Fair.findOneAndUpdate(
    {_id: id},
    { $push: { chaperones: fairChaperone} },
    async (err, fair) => {

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

  let id = req.body.id

  let partner = {
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    phone: req.body.phone,
    logo: req.body.logo,
    lunch: req.body.lunch,
    colleagues: req.body.colleagues,
    dateRegistered: format(Date.now(), 'MMMM dd, yyyy'),
    timeRegistered: format(Date.now(), 'hh:mm a')
  }

  let fairPartner = FairPartner(partner)

  Fair.findOneAndUpdate(
    {_id: id},
    { $push: { partners: fairPartner} },
    async (err, fair) => {

    if (err) return await res.status(400).send('Error finding partners');

    if (!partner) return await res.status(400).send('There were no partners with that id');

    await console.log(fair);

    fairDate = format(fair.date, 'MMMM dd, yyyy'),
    fairTime = format(fair.date, 'hh:mm a')

    const partnerMailOptions = {
      from: 'eddielacrosse2@gmail.com', // sender address
      to: `${partner.email}`, // list of receivers
      subject: `You have registered for ${fair.title}`,
      html: `
      <h3>Hi ${partner.name}!<br>
      You have registered as a Chaperone for ${fair.title} on the date of ${partner.dateRegistered} at ${partner.timeRegistered}.</h3>
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
//  configuration for email details





