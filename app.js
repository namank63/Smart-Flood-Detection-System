/**********************************************
CONSTANT VARIABLE DECLARATION
**********************************************/
const express = require("express");
const app = express();
const path = require('path');
const request = require("request");
const passport = require('passport');
const fast2sms = require('fast-two-sms');
const bodyParser = require("body-parser");
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const expressSanitizer = require("express-sanitizer");
const DataBaseConnect = require("./database/connection");
const passportLocalMongoose = require('passport-local-mongoose');



/**********************************************
ROUTERS
**********************************************/
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/user');
const blogsRouter = require('./routes/blog');



/**********************************************
APP CONFIGURATION
**********************************************/
//DataBase Connect
DataBaseConnect();
const Blog = require('./models/blog');
const User = require('./models/user');
const Admin = require('./models/admin');

//App Configuration
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
require('dotenv').config();

//Authentication
const { isLoggedIn } = require("./middleware");
app.use(require('express-session')({
    secret: "secretsecretsecretsecretsecret",
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})



/**********************************************
APP ROUTES
**********************************************/
//landing page
var nextDate = Date.now();
app.get('/', async (req, res) => {
    let numbers = new Set();
    const blogs = await Blog.find({});
    const users = await User.find({});
    const admins = await Admin.find({});
    users.forEach(function (user) {
        numbers.add(Number(user.mobile));
    });
    admins.forEach(function (admin) {
        numbers.add(Number(admin.mobile));
    });            
    let phone_no = [];
    numbers.forEach(function (number) {
        phone_no.push(number);
    });
    request(process.env.RETRIVE_THINGSPEAK_API, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            let ultrasonicSensorReading = Number(data.feeds[0].field1);
            let walterSensorReading = Number(data.feeds[0].field2);
            let colorLevel;
            let floodStatus;
            if (ultrasonicSensorReading >= 61) {
                colorLevel = 'bg-success';
                floodStatus = 'Normal';
            } else if (ultrasonicSensorReading >= 31 && ultrasonicSensorReading <= 60) {
                colorLevel = 'bg-warning';
                floodStatus = 'Medium';
            } else if (ultrasonicSensorReading <= 30 && walterSensorReading >= 70) {
                const warningMessage = "Emergency Alert: Your area is prone to flood as estimated by our Smart Flood Detection System. Read more block on the website!!";
                colorLevel = 'bg-danger';
                floodStatus = 'Danger';
                if (nextDate <= Date.now()) {
                    // const sms = fast2sms.sendMessage({
                    //     authorization: process.env.SMS_API_KEY, 
                    //     message: warningMessage, 
                    //     numbers: phone_no
                    // });
                    // console.log(`Message sent successfully to ${numbers.size} users!!`)
                    // nextDate = Date.now() + 259200000;


                }
            }
            res.render("index", {
                ultrasonicSensorReading: ultrasonicSensorReading,
                walterSensorReading: walterSensorReading,
                colorLevel: colorLevel,
                floodStatus: floodStatus,
                blogs: blogs
            });
        }
    })
});

//Admin Login Page
app.get("/admin", isLoggedIn, async (req, res)=> {
    const blogs = await Blog.find({});
    res.render("admin/admin", { blogs });
});

app.use('/', adminRouter);
app.use('/', usersRouter);
app.use('/', blogsRouter);

/**********************************************
SERVER
**********************************************/
app.listen(3000, () => {
    console.log("Server is Started!!");
});