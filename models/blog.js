const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    image: String,
    body: String,
    department: String,
    created: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('Blog', blogSchema);