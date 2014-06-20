var settings = require('./settings');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pro');

module.exports = mongoose;