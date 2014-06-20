var mongoose = require("mongoose");

var inventoryScheme = mongoose.collection("inventory",{
	name: "golf club",
	desc: "A 9 iron"
});

expose.inventoryScheme = inventoryScheme;