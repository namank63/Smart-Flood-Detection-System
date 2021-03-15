const express = require("express");
const app = express();
const request = require("request");

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    var query = req.query.search;
    url = "https://api.thingspeak.com/channels/1305440/feeds.json?api_key=9F03467TIMIAY1LI&results=2";
    // url = "https://api.thingspeak.com/channels/1305440/fields/1.json?api_key=9F03467TIMIAY1LI&results=2";
    request(url, function (error, response, body) {
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
                colorLevel = 'bg-danger';
                floodStatus = 'Danger';
            }
            res.render("index.ejs", { ultrasonicSensorReading: ultrasonicSensorReading, walterSensorReading: walterSensorReading, colorLevel: colorLevel, floodStatus: floodStatus });
        }
    });
});

app.get('/adminLogin', (req, res) => {
    res.render("adminLogin.ejs");
});

app.listen(3000, () => {
    console.log("Server Started!!");
});