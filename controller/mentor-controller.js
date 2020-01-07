const Event = require('../models/mentor.model');

exports.getMentors = (res, req) => {
  Event.find( (err, mentors) => {
    if (err) return res.status(400).send('Error finding mentors');
    return res.send(mentors);
  })
}

exports.mentorMessage = (res, req) => {

}
