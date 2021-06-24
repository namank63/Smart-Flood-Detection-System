const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    location: String,
    mobile: String,
    added: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', userSchema);