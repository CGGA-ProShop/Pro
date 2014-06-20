var mongoose = require("mongoose");

var ItemsSchema = mongoose.Schema({
    name: String
});

module.exports = ItemsSchema;