var con = require("./../mongo");

var pages = {
    cart: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        con.connect(function(err, db){
            db.collection("cart").find().toArray(function(err, items){
                res.send(items);
            });
        });
    }, cartAdd: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var item = req.body.item;
        item.user = con.ObjectId.createFromHexString(item.user.session);
        con.connect(function(err, db) {
            var collection = db.collection("cart");
            collection.insert(item, function(err, items){
                collection.find().toArray(function(err, items) {
                    res.send(items);
                });
            });
        });
    }, items: function(req, res) {
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
            var collection = db.collection("items");
            collection.find({"_id" : objectID}).each(function(err, item) {
                res.end(JSON.stringify(item));
            });
        });
    }
};


module.exports = pages;