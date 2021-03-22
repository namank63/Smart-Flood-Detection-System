/*********************************************************
ONLINE MONGODB CONFIGURATION
**********************************************************/
require('dotenv').config();
const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(process.env.DATABASE_API, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log("Online DataBase is connected!!");
}

module.exports = connectDB;