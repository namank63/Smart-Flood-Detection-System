/**********************************************
USER ROUTES
**********************************************/
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { isLoggedIn } = require("../middleware");

//New Route
router.get("/newuser", isLoggedIn, async (req, res) => {
    const users = await User.find({});
    res.render("newuser", { users });
});

//Create Route
router.post("/newuser", isLoggedIn, function (req, res) {
    //create blog
    req.body.user.body = req.sanitize(req.body.user.body);
    User.create(req.body.user, function (err, newUser) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/newuser");
        }
    });
});

//Delete Route
router.post("/delete", isLoggedIn, function (req, res) {
    User.deleteOne({ mobile: req.body.mobile }).then(function () {
        console.log("User deleted");
        res.redirect("/newuser");
    }).catch(function (error) {
        console.log(error);
    });
});

module.exports = router;