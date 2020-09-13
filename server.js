const config                  = require("config");
const express                 = require("express");
const app                     = express();
const mongoose                = require("mongoose");
const passport 	              = require('passport');
const cors                    = require('cors');
const dotenv                  = require('dotenv');
const colors                  = require('colors');
const User             = require('../Express/models/user.model')


// User Routes
const landingRoute           = require("./routes/landing.route");
const signupRoute            = require("./routes/signup.route");
const loginCredentialsRoute  = require("./routes/login-credentials");
const userRoute              = require("./routes/user.route");
const photoRoute             = require("./routes/photo.route");
const resumeRoute             = require("./routes/resume.route");
const jobRoute               = require("./routes/job.route");
const eventRoute             = require("./routes/events.route");
const mentorRoute            = require("./routes/mentors.route");
const postRoute              = require("./routes/posts.route");
const fairsRoute             = require("./routes/fairs.route");
const notificationsRoute     = require("./routes/notifications.route");


// Admin Routes
const adminLoginRoute        = require("./routes/admin/login.route");
const adminPhotoRoute        = require("./routes/admin/photo.route");
const adminJobsRoute         = require("./routes/admin/jobs.route");
const adminStudentsRoute     = require("./routes/admin/students.route");
const adminMentorsRoute      = require("./routes/admin/mentor.route");
const adminEventsRoute       = require("./routes/admin/events.route");
const adminPostsRoute        = require("./routes/admin/posts.route");
const adminFairsRoute        = require("./routes/admin/fairs.route");

// Configure Environment Variables
dotenv.config();

// Initiate Socket.IO Config

console.log(process.env.DB_HOST_DEV)


// use config module to get the privatekey, if no private key set, end the application
if (!config.get("jwtSecret")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

// config and connect to mongodb
// console.log('Attempting connection to Mongo Atlas...');
console.log('Connecting via Mongoose to host: ');

mongoose
  // For DeprecationWarning:  collection.ensureIndex is deprecated.  Use createIndexes instead.

  .set('useCreateIndex', true)
  .set('useFindAndModify', false)

  .connect(process.env.DB_HOST_DEV, { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => console.log("Connected to MongoDB...\n"))

  .catch(err =>
    console.error(err))
// // Use the passport package in our application
app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

app.use(cors());
app.use(express.json());

app.use("/api/", landingRoute);
// Signup
app.use("/api/login-credentials", loginCredentialsRoute);
app.use("/api/signup", signupRoute);
app.use("/api/home/user", userRoute);
// app.use("/api/home/jobs", profileRoute);
app.use("/api/photo", photoRoute);
app.use("/api/resume", resumeRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/mentors", mentorRoute);
app.use("/api/events", eventRoute);
app.use("/api/posts", postRoute);
app.use("/api/fairs", fairsRoute);
app.use("/api/notifications", notificationsRoute);

// Admin
app.use("/api/admin/", adminLoginRoute);
app.use("/api/admin/photo", adminPhotoRoute);
app.use("/api/admin/jobs", adminJobsRoute);
app.use("/api/admin/students", adminStudentsRoute);
app.use("/api/admin/mentors", adminMentorsRoute);
app.use("/api/admin/events", adminEventsRoute);
app.use("/api/admin/posts", adminPostsRoute);
app.use("/api/admin/fairs", adminFairsRoute);

const port = process.env.PORT || 3000;
server = app.listen(port, () => console.log(`Listening on port ${port}...`));

io = require('socket.io')(server);

const studentNamespace = io.of('/student-chat')
const mentorNamespace = io.of('/mentor-chat')

studentNamespace.on('connection', socket => {
    let namespace = 'student-chat';
    getNameSpaceInfo(namespace, socket);
    addChatRoomEvent(namespace, socket);
}
)

// mentorNamespace.on('connection', socket => {
//   let namespace = 'mentor-chat';
//   getNameSpaceInfo(namespace, socket);
//   addChatRoomEvent(namespace, socket);
// })

function getNameSpaceInfo(namespace,socket) {
  console.log(`${socket.id} connected to ${namespace} namespace. `.bgGrey.yellow)
  console.log('\n');
  console.log(`Active connections to ${namespace} namespace`.brightBlue);
  console.log(Object.keys(socket.nsp.connected))
  console.log('\n');
}

function addChatRoomEvent(namespace, socket) {
  socket.on('addChatroom', chatroom => {
    // TODO: add chat to Database
    console.log('new chat room added'.brightMagenta);
    console.log(chatroom)


    let newConvo = {
      chatId: chatroom.chatId,
      dateCreated: Date.now(),
      requestingUserName: chatroom.requestingUserName,
      requestingUserEmail: chatroom.requestingUserEmail,
      respondingUserName: chatroom.respondingUserName,
      messages: []
    }

    // update users student chat array
    User.findOneAndUpdate(
      { email: chatroom.requestingUserEmail},
      { $push: { studentChat:  newConvo} },
      { new: true },
      (err, user) => {
        if(err) { return console.log(err) }
        console.log(user)
      }
    )

    socket.join(chatroom.chatId, () => {
      let rooms = socket.rooms;
      console.log('Rooms in '.cyan + namespace.cyan + ' namespace'.cyan);
      console.log(rooms);
    })
  })
}
