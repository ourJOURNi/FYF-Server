const config                  = require("config");
const express                 = require("express");
const app                     = express();
const mongoose                = require("mongoose");
const passport 	              = require('passport');
const cors                    = require('cors');
const dotenv                  = require('dotenv');
const WebSocket               = require('ws');

// User Routes
const landingRoute           = require("./routes/landing.route");
const signupRoute            = require("./routes/signup.route");
const forgotPasswordRoute            = require("./routes/forgot-password.route");
const loginCredentialsRoute  = require("./routes/login-credentials");
const userRoute              = require("./routes/user.route");
const photoRoute             = require("./routes/photo.route");
const resumeRoute            = require("./routes/resume.route");
const jobRoute               = require("./routes/job.route");
const eventRoute             = require("./routes/events.route");
const mentorRoute            = require("./routes/mentors.route");
const postRoute              = require("./routes/posts.route");
const notificationsRoute     = require("./routes/notifications.route");



// Configure Environment Variables
dotenv.config();
// use config module to get the privatekey, if no private key set, end the application
if (!config.get("jwtSecret")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

console.log(process.env.DB_HOST_DEV)
console.log('Connecting via Mongoose to host: ');
mongoose
  // For DeprecationWarning:  collection.ensureIndex is deprecated.  Use createIndexes instead.
  .set('useCreateIndex', true)
  .set('useFindAndModify', false)
  .connect(process.env.DB_HOST_DEV, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB...\n"))
  .catch(err =>
    console.error(err));

app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

app.use(cors());
app.use(express.json());

app.use("/api", landingRoute);
// Signup
app.use("/api/login-credentials", loginCredentialsRoute);
app.use("/api/signup", signupRoute);
app.use("/api/forgot-password", forgotPasswordRoute);
app.use("/api/home/user", userRoute);
// app.use("/api/home/jobs", profileRoute);
app.use("/api/photo", photoRoute);
app.use("/api/resume", resumeRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/mentors", mentorRoute);
app.use("/api/events", eventRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationsRoute);


const port = process.env.PORT || 3000;
server = app.listen(port, () => {
  console.log('Starting FYF Server\n');
  console.log(`Listening on port ${port}...`)
});

// WebSockets
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', ws => {
  onConnection(ws);
  ws.on('message', message => {
    onMessage(message, ws);
  });
  ws.on('error', error => {
    OnError(error);
  });
   ws.on('close', ws=> {
    onClose();
})
});

function onConnection(ws) {
  console.log('Connected to Web Socket');
}
function onMessage(message, ws) {
  console.log(message)
}
function OnError(err) {
  console.log(err)
}
function onClose(ws) {
  console.log('Web Socket Closed.')
}
