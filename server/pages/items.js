var con = require("./../mongo");

var pages = {
    cart: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        con.connect(function(err, db){
            if(req.body.items)
                var list = req.body.items.split(',');
            else
                var list = [];
            if(list&&list.length && list[0] != null && list[0] != 'null')
                for(var i = 0; i < list.length; i++) {
                    list[i] = con.ObjectId(list[i]);
                }
            db.collection("cart").find({cartId: {$in:list}}).toArray(function(err, items){
                console.log(items);
                res.send(items);
            });
        });
    }, cartAdd: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var item = req.body.item;
        console.log("adding item");

        item._id = undefined;
        item.cartId = con.ObjectId();
        con.connect(function (err, db) {
            var collection = db.collection("cart");
            collection.insert(item, function (err, items) {
                res.send(item.cartId);
            });
        });
    }, cartUpdate: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var item = req.body.item;
        console.log("updating item");
        console.log(item);
        con.connect(function (err, db) {
            var collection = db.collection("cart");
            collection.findAndModify(
                {cartId: con.ObjectId(item.cartId)},
                {},
                {$set:{qty:item.qty}},
                {},
                function(err, object) {
                    if(err){ console.warn(err.message); }
                }
            );
        });
    }, categories: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        con.connect(function(err, db) {
            if(err) {return console.log(err); }
            db.collection("category").find().sort({"category":1,type:1}).toArray(function (err, categories){
                res.send(categories);
            });
        });
    }, deals: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        con.connect(function(err, db) {
            if(err) { return console.log(err); }
            db.collection("items").find({discount:'.75'})
                .toArray(function(err, items) {
                    res.send(items);
                });
        });
    }, items: function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        con.connect(function(err, db) {
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