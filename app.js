const express = require("express");
const app = express();
const request = require("request");

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    var query = req.query.search;
    url = "https://api.thingspeak.com/channels/1305440/fields/1.json?api_key=9F03467TIMIAY1LI&results=1";
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            console.log(data);
            // console.log(data.feeds[0].field1);
            res.render("index.ejs", { data: data });
        }
    });
});

app.get('/adminLogin', (req, res) => {
    res.render("adminLogin.ejs");
});

app.listen(3000, () => {
    console.log("Server Started!!");
});