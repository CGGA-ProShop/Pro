var mongoose = require("mongoose");

var tables = ["users","user_info"];

var db = mongoose.connection({ip:"mongoose://localhost/"},tables);

// db uses database not test

expose.mongoose = db;