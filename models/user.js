/*********************************************************
USER SCHEMA
**********************************************************/
const mongoose = require("mongoose");

const UserSchema= new mongoose.Schema({
    name: String,
    number: String,
    address: {
        city: String,
        pincode: String,
        state: String
    }
});

module.exports=mongoose.model("User",UserSchema);