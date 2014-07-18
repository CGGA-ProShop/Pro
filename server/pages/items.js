var con = require("./../mongo");

var pages = {
    items: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        con.connect(function(err, db){
            if(err) { return console.log(err); }
            db.collection("items").find()
            .toArray(function(err, items) {
                res.send(items);
            });
        });
    }, item: function(req, res, id){
        res.setHeader('Content-Type', 'application/json');
        var objectID = con.ObjectId(id);
        con.connect(function(err, db) {
            if(err) { return console.log(err); }
            db.collection("items").find({"_id" : objectID})
            .each(function(err, item) {
                res.end(JSON.stringify(item));
            });
        });
    }
};


module.exports = pages;