/**********************************************
BLOG ROUTES
**********************************************/
const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const { isLoggedIn } = require("../middleware");

/*
index: /
new: /blog/new
create: /
show: /:id
edit: /:id/edit
update: /:id
delete: /:id
*/

//New Route
router.get("/new", isLoggedIn, function (req, res) {
    res.render("new");
});

//Create Route
router.post("/", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/admin");
        }
    });
});

//Show Route
router.get("/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

//Show Route
router.get("/showAdmin/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("showAdmin", { blog: foundBlog });
        }
    });
});

//Edt Route
router.get("/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//Update Route
router.put("/:id", function (req, res) {
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
router.delete("/:id", function (req, res) {
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

module.exports = router;