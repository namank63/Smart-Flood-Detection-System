/*********************************************************
ADMIN SCHEMA
**********************************************************/
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name: String,
    number: String,
    authority: String,
    password: String,
    blogs: [{
        title: String,
        content: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model("Admin", AdminSchema);