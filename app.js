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



/**********************************************
APP ROUTES
**********************************************/
//landing page
app.get('/', (req, res) => {
    var blogs;
    Blog.find({}, function (err, allBlogs) {
        if (err) {
            console.log(err);
        } else {
            blogs = allBlogs;
        }
    });
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
                colorLevel: colorLevel, floodStatus: floodStatus,
                blogs: blogs
            });
        }
    });
});

//Admin Login Page
app.get('/login', (req, res) => {
    res.render("login.ejs");
});

app.get("/admin", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("admin.ejs", { blogs: blogs });
        }
    });
});


/**********************************************
BLOG ROUTES
**********************************************/
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);

//New Route
app.get("/new", function (req, res) {
    res.render("new");
});

//Create Route
app.post("/", function (req, res) {
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/admin");
        }
    });
});

//Show Route
app.get("/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

//Edt Route
app.get("/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});


//Update Route
app.put("/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/");
        } else {
            res.redirect("/" + req.params.id);
        }
    });
});

//Delete Route
app.delete("/:id", function (req, res) {
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
    //redirect somewhere
});

//Server
app.listen(3000, () => {
    console.log("Server is Started!!");
});