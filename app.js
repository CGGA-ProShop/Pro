var express = require("express");
var settings = require("./server/settings");
var db = require("./server/db.js");
var inventory = require('./server/pages/items');


var app = express();

app.use(function(req,res,next){
    console.log("Accepted connection: "+req.url);
    next();
});

// Resource API
app.get("/r/inventory/",function(req,res){inventory.items(req,res)});
app.get("/r/inventory/:item",function(req, res){inventory.item(req,res)});

// Serves static pages in the public path
app.use(express.static(__dirname + '/public'));


app.listen(settings.server.port);
console.log('Server up and running at: '+settings.server.fullPath()+' on port: '+ settings.server.port);