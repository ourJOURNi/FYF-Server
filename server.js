const config            = require("config");
const mongoose          = require("mongoose");
const express           = require("express");
const passport 	        = require('passport');
const app               = express();
const cors              = require('cors');

// User Routes
const landingRoute      = require("./routes/landing.route");
const signupRoute       = require("./routes/signup.route");
const loginCredentialsRoute = require("./routes/login-credentials");
const userRoute      = require("./routes/user.route");
const photoRoute        = require("./routes/photo.route");

// Admin Routes
const adminLoginRoute  = require("./routes/admin/login.route");
const jobsRoute        = require("./routes/admin/jobs.route");
const studentsRoute  = require("./routes/admin/students.route");

// use config module to get the privatekey, if no private key set, end the application
if (!config.get("jwtSecret")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

// config and connect to mongodb
mongoose
  // For DeprecationWarning:  collection.ensureIndex is deprecated.  Use createIndexes instead.
  .set('useCreateIndex', true)
  .set('useFindAndModify', false)

  // 127.0.0.1 is local database
  .connect("mongodb://127.0.0.1/United_Way_App", { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => console.log("Connected to MongoDB..."))

  .catch(err => console.error("Could not connect to MongoDB..."));

// // Use the passport package in our application
app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

app.use(cors());
app.use(express.json());
  // Landing page
app.use("/api/", landingRoute);
  // Signup page
app.use("/api/login-credentials", loginCredentialsRoute);
// API for saving users
app.use("/api/signup", signupRoute);
// API Profile Page
app.use("/api/home/user", userRoute);
// API Profile Page
// app.use("/api/home/jobs", profileRoute);
// API for uploading an image
app.use("/api/photo", photoRoute);

// Admin 
app.use("/api/admin/", adminLoginRoute);
app.use("/api/admin/jobs", jobsRoute);
app.use("/api/admin/students", studentsRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));