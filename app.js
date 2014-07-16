var express = require("express");
var bodyParser = require("body-parser");
var settings = require("./server/settings");
var db = require("./server/db.js");
var inventory = require('./server/pages/items');

var app = express();

var USER_ROLES = {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
};

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Resource API
app.post("/login",function(req, res) {
    console.log("Login attempt.");
    //req.body { username: '', password: '' }

    var user = "Brandon";
    var pass = "abc";
    if(req.body.username.toLowerCase() === user.toLowerCase()) {
        if(req.body.password === pass) {
            res.send(200, {id: 1, user: {name: req.body.username, role: USER_ROLES.admin}});
        } else {
            res.send(401, {error:"Password does not match."});
        }
    } else {
        res.send(401, {error:"User does not exist."});
    }


    console.log(JSON.stringify({id: 1, user: {name: req.body.username, role: USER_ROLES.admin}}));
});

app.post("/signUp",function(req, res) {
    console.log("Sign up attempt.");
    //req.body { username: '', password: '' }
    res.send({id: 1, user: {name: req.body.username, role: USER_ROLES.admin}});
    console.log(JSON.stringify({id: 1, user: {name: req.body.username, role: USER_ROLES.admin}}));
});

app.get("/r/inventory/",function(req,res){inventory.items(req,res)});
app.get("/r/inventory/:item",function(req, res){inventory.item(req,res)});

// Serves static pages in the public path
app.use(express.static(__dirname + '/public'));

app.use(function(req,res){
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect(301,'/#/error?d='+fullUrl);
});


app.listen(settings.server.port);
console.log('Server up and running at: '+settings.server.fullPath()+' on port: '+ settings.server.port);
console.log('Press Ctrl + C to stop.');
