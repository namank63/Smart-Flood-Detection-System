var express = require("express");
var app = express();
var request = require("request");

var query = 1;
var interval = 16 * 1000; //16 seconds
for (var i = 0; i < 10; i++) {
    setTimeout(function (i) {
        url = "https://api.thingspeak.com/update?api_key=PIHD73ES1100H0N3&field1=" + query;
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body)
                console.log("input count: " + data + " :: input value: " + query);
                query = Math.floor(Math.random() * 100) + 1;
            }
        });
    }, interval * i, i);
}

app.listen(4000, function () {
    console.log("Seeding Started!!");
});