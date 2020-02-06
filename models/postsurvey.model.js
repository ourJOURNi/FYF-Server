let PostSurveySchema = new mongoose.Schema({
  fullName: {
    type: String,
    maxlength: 100
  },
  school: {
    type: String,
    maxlength: 100
  },
  questionOne: {
    type: String,
    maxlength: 100
  },
  questionTwo: {
    type: String,
    maxlength: 100
  },
  questionThree: {
    type: String,
    maxlength: 100
  },
  questionFour: {
    type: String,
    maxlength: 100
  },
  questionFive: {
    type: String,
    maxlength: 100
  },
})