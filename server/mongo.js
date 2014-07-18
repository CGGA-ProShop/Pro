var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;

var connString = require("./connectionString");

var mydb;

var db = {};
db.ObjectId = ObjectId;
db.connect = function (callback) {
    if(mydb === undefined){
        MongoClient.connect(connString, function(err, returnDB){
            if(err) {return callback(err)}
            mydb = returnDB;
            callback(null, returnDB);
        });
    } else {
        callback(null, mydb);
    }
};

module.exports = db;

