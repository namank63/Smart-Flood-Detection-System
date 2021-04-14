/*********************************************************
USER SCHEMA
**********************************************************/
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

module.exports=mongoose.model("Blog",BlogSchema);