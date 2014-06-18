var express = require("express");

var app = express();


app.get("/inventory/",function(req, res){
    var id = req.params.item;
    console.log(id);
    res.send(id);
});


app.get("/inventory/:item",function(req, res){
    var id = req.params.item;
    console.log(id);
    res.send(id);
});

app.use(express.static(__dirname + '/public'));


app.listen(8888);