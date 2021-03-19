/**********************************************
CONSTANT VARIABLE DECLARATION
**********************************************/
const express     = require("express");
const app         = express();
const request     = require("request");
const fast2sms    = require('fast-two-sms');


/**********************************************
CONFIGURATION
**********************************************/
require('dotenv').config();
app.use(express.static(__dirname + "/public"));


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
app.get('/adminLogin', (req, res) => {
    res.render("adminLogin.ejs");
});

//Server
app.listen(3000, () => {
    console.log("Server is Started!!");
});