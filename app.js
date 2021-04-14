/**********************************************
CONSTANT VARIABLE DECLARATION
**********************************************/
const express = require("express"),
    app = express(),
    request = require("request"),
    fast2sms = require('fast-two-sms'),
    mongoose = require("mongoose"),
    methodOverride = require('method-override'),
    expressSanitizer = require("express-sanitizer"),
    bodyParser = require("body-parser");


/**********************************************
APP CONFIGURATION
**********************************************/
//App Configuration
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
require('dotenv').config();

/**********************************************
DATABASE CONFIGURATION
**********************************************/
mongoose.connect(process.env.DATABASE_API, { useUnifiedTopology: true, useNewUrlParser: true }, function (err, db) {
    if (err) {
        console.log("DataBase connection Error");
    } else {
        console.log("DataBase connected Sucessfully");
    }
});

User = require("./models/user");
Admin = require("./models/admin");
Blog = require("./models/admin");



/**********************************************
ROUTES
**********************************************/
//landing page
app.get('/', (req, res) => {
    var query = req.query.search;
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
                // const sms = fast2sms.sendMessage({
                //     authorization: process.env.SMS_API_KEY, 
                //     message: warningMessage, 
                //     numbers: ["8604848731"]
                // });
                // console.log(sms);
            }
            res.render("index.ejs", {
                ultrasonicSensorReading: ultrasonicSensorReading,
                walterSensorReading: walterSensorReading,
                colorLevel: colorLevel, floodStatus: floodStatus
            });
        }
    });
});

//Admin Login Page
app.get('/login', (req, res) => {
    res.render("login.ejs");
});

//Admin Page
app.get('/admin', (req, res) => {
    res.render("admin.ejs");
});

//Server
app.listen(3000, () => {
    console.log("Server is Started!!");
});