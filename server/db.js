var settings = require('./settings');
var mongoose = require('./mongoose');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log('Connection open: '+settings.database.fullPath())
});


module.exports = db;