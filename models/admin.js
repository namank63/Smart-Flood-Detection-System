const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = new Schema({
    username: String,
    department: String,
    email: String,
    mobile: String,
    district: String
});

adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Admin', adminSchema);