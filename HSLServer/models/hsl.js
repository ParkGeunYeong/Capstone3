const mongoose = require('mongoose');

const {Schema} = mongoose;
const hsl = new Schema({
    hslOrder : Number,
    XPath : String,
    parentStrIndex : Number,
    childStrIndex : Number,
    textLength : Number
});

module.exports = mongoose.model('HSL', hsl);