var pages = {
    items: function(req, res) {
        var Items = require('./../models/items');
        Items.find(function(err, items){
            if(err) return console.error(err);
            res.send(items);
        });
    },
    item: function(req, res){
        var Items = require('./../models/items');
        Items.find(function(err, items){
            if(err) return console.error(err);
            res.send(items);
        });
    }
};


module.exports = pages;