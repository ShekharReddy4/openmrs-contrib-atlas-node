var mongoose = require('mongoose');

// Genre Schema
var markerschema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    create_date:{
        type: Date,
        default: Date.now
    }
});

var Marker = module.exports = mongoose.model('Marker', markerschema);

// Get Genres
module.exports.getmarker = function(callback, limit){
    Marker.find(callback).limit(limit);
}
