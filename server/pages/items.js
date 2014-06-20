var mongoose = require('./../mongoose');
var db = require('./../db');

var pages = {
    items: function(req,res){
        var ItemSchema = mongoose.Schema({
            name: String
        });
        var Items = mongoose.model('items',ItemSchema);

        Items.find(function(err, items){
            if(err) return console.error(err);
            res.send(items);
        });
    }
};


module.exports = pages;