var mongoose = require('mongoose');
var ItemsSchema = require('./itemsSchema');

var Items = mongoose.model('items',ItemsSchema);

module.exports = Items;

