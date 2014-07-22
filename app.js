var express = require("express");
var bodyParser = require("body-parser");
var settings = require("./server/settings");

var auth = require('./server/pages/authentication');
var inventory = require('./server/pages/items');

var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Resource API
app.post("/login", function(req, res) {auth.login(req, res)});
app.post("/signUp", function(req, res) {auth.signUp(req, res)});
app.get("/r/deals/", function(req, res) {inventory.deals(req, res)});
app.get("/r/categories/", function(req, res) {inventory.categories(req, res)});
app.get("/r/items/", function(req, res) {inventory.items(req, res)});
app.get("/r/item/:item", function(req, res) {inventory.item(req, res, req.params.item)});

//Todo: Cart System
app.post("/cart", function(req, res) {inventory.cartAdd(req, res)});
app.post("/r/cart/", function(req, res) {inventory.cart(req, res)});
app.post("/u/cart/", function(req, res) {inventory.cartUpdate(req, res)});


// Serves static pages in the public path
app.use(express.static(__dirname + '/public'));

app.use(function(req,res){
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect(301,'/#/error?d='+fullUrl);
});


app.listen(settings.server.port);
console.log('Server up and running at: '+settings.server.fullPath()+' on port: '+ settings.server.port);
console.log('Press Ctrl + C to stop.');
