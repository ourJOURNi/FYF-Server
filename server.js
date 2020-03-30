const config            = require("config");
const mongoose          = require("mongoose");
const express           = require("express");
const multer            = require("multer");
const fs                = require("fs");
const passport 	        = require('passport');
const app               = express();
const cors              = require('cors');

// User Routes
const landingRoute           = require("./routes/landing.route");
const signupRoute            = require("./routes/signup.route");
const loginCredentialsRoute  = require("./routes/login-credentials");
const userRoute              = require("./routes/user.route");
// const photoRoute             = require("./routes/photo.route");
const jobRoute               = require("./routes/job.route");
const eventRoute             = require("./routes/events.route");
const mentorRoute            = require("./routes/mentors.route");
const postRoute              = require("./routes/posts.route");
const fairsRoute             = require("./routes/fairs.route");

// Admin Routes
const adminLoginRoute        = require("./routes/admin/login.route");
const adminJobsRoute         = require("./routes/admin/jobs.route");
const adminStudentsRoute     = require("./routes/admin/students.route");
const adminMentorsRoute      = require("./routes/admin/mentor.route");
const adminEventsRoute       = require("./routes/admin/events.route");
const adminPostsRoute        = require("./routes/admin/posts.route");
const adminFairsRoute        = require("./routes/admin/fairs.route");


// use config module to get the privatekey, if no private key set, end the application
if (!config.get("jwtSecret")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

// config and connect to mongodb
console.log('Attempting to connect to Amazon Document DB');

mongoose
  // For DeprecationWarning:  collection.ensureIndex is deprecated.  Use createIndexes instead.

  .set('useCreateIndex', true)
  .set('useFindAndModify', false)

  // 127.0.0.1 is local database
  .connect("mongodb://eddietal2:Et061792@fyf-app.cluster-cwubsingroad.us-east-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false", { useNewUrlParser: true, useUnifiedTopology: true })

  // mongodb://eddietal2:<insertYourPassword>@fyf-app.cluster-cwubsingroad.us-east-1.docdb.amazonaws.com:27017
  // mongodb://127.0.0.1/United_Way_App"

  .then(() => console.log("Connected to MongoDB..."))

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
// app.use("/api/photo", photoRoute);
app.use("/api/job", jobRoute);
app.use("/api/mentors", mentorRoute);
app.use("/api/events", eventRoute);
app.use("/api/posts", postRoute);
app.use("/api/fairs", fairsRoute);

// Admin
app.use("/api/admin/", adminLoginRoute);
app.use("/api/admin/jobs", adminJobsRoute);
app.use("/api/admin/students", adminStudentsRoute);
app.use("/api/admin/mentors", adminMentorsRoute);
app.use("/api/admin/events", adminEventsRoute);
app.use("/api/admin/posts", adminPostsRoute);
app.use("/api/admin/fairs", adminFairsRoute);



// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));