var db = require("db");
var inventorySchema = require("inventorySchema");


inventory = db.collection(inventorySchema);

expose.inventory = inventory;