const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Admin = require('../models/admin');

router.get('/register', (req, res) => {
    res.render('admin/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const {username, department, mobile, email, password} = req.body;
        const admin = new Admin({username, department, mobile, email});
        const registeredAdmin = await Admin.register(admin, password);
        const newAdmin = await registeredAdmin.save();
        const id = registeredAdmin._id;
        req.login(registeredAdmin, err => {
            if (err) return send("Login Failed!!");
            res.redirect('/login');
        })
    } catch (e) {
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('admin/login');
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/login' }), (req, res) => {
    id = req.user._id;
    res.redirect('/admin');
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;