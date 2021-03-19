/**********************************************
CONSTANT VARIABLE DECLARATION
**********************************************/
const express   = require("express");
const app       = express();
const request   = require("request");


/**********************************************
CONFIGURATION
**********************************************/
require('dotenv').config();


/**********************************************
SEEDING
**********************************************/

//Variables
var ultrasonic = 100;
var water      = 100;
var interval   = 16 * 1000; //set for 16 second rotation


//Function
for (var i = 0; i < 10; i++) {
    setTimeout(function (i) {
        url = process.env.SEED_THINGSPEAK_API + ultrasonic + "&field2=" + water;
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body)
                ultrasonic = Math.floor(Math.random() * 100) + 1;
                if (ultrasonic <= 30) {
                    water = Math.floor(Math.random() * (100 - 70) + 70);
                } else {
                    water = 0;
                }
                console.log("Ultrasonic Sensor input count: " + data + " :: Value: " + ultrasonic);
                console.log("Water Sencer input count: " + data + " :: Value: " + water);
            }
        });
    }, interval * i, i);
}

//Server
app.listen(4000, function () {
    console.log("Seeding Started!!");
});