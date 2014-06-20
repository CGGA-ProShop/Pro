var express = require("express");

var app = express();

var server = {
    port: 8080
};


app.get("/inventory/",function(req, res){
});


app.get("/inventory/:item",function(req, res){
    var id = req.params.item;
    console.log(id);
    res.send(id);
});

app.use(express.static(__dirname + '/public'))


app.listen(server.port);
console.log("Server up and running on port: " + server.port);