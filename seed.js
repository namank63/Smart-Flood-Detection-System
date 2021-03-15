var express = require("express");
var app = express();
var request = require("request");

var ultrasonic = 100;
var water = 100;
var interval = 16 * 1000; //16 seconds
for (var i = 0; i < 10; i++) {
    setTimeout(function (i) {
        url = "https://api.thingspeak.com/update?api_key=PIHD73ES1100H0N3&field1=" + ultrasonic + "&field2=" + water;
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body)
                ultrasonic = Math.floor(Math.random() * 100) + 1;
                if (ultrasonic <= 30) {
                    water = Math.floor(Math.random() * (100 - 70) + 70);
                    // water = Math.floor(Math.random() * 100) + 1;
                } else {
                    water = 0;
                }
                console.log("Ultrasonic Sensor input count: " + data + " :: Value: " + ultrasonic);
                console.log("Water Sencer input count: " + data + " :: Value: " + water);
            }
        });
    }, interval * i, i);
}

app.listen(4000, function () {
    console.log("Seeding Started!!");
});