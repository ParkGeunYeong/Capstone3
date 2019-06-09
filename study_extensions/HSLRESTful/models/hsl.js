const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const hslSchema = new Schema({
    url_from : String,
    url_to : { type : String, default : "yet"},
    XPath : String,
    parentStrIndex : Number,
    childStrIndex : Number,
    textLength : Number,
    text : String,
    published_date: Number,
},{collation : 'hsl'});

module.exports = mongoose.model('hsl', hslSchema);