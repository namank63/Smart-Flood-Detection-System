const mongoose = require("mongoose");
const catchAsync = require('../utils/catchAsync');
require('dotenv').config();

const DataBaseUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/sfds";

const DataBaseConnect = catchAsync(async() => {
    await mongoose.connect(DataBaseUrl, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log("DataBase Connected!!");
});

module.exports = DataBaseConnect;