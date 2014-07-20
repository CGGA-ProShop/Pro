var con = require("./../mongo");
var USER_ROLES = require("./../roles");

var methods = {
    login: function(req, res){
        res.setHeader('Content-Type', 'application/json');
        console.log("Login attempt, user: "+req.body.username+" pwd: "+req.body.password);
        var user = req.body.username;
        var pass = req.body.password;

        con.connect(function(err, db){
            var collection = db.collection("users");
            collection.find({username: user}).toArray(function(err, users){
               if(users.length) {
                   var dbUser = users[0];
                   if(dbUser.password.toLowerCase() == pass.toLowerCase()) {
                       res.send(200, JSON.stringify({id: dbUser._id, user: {name: dbUser.username, role: dbUser.role}}));
                   } else {
                       res.send(401, JSON.stringify({error:"Password does not match."}));
                   }
               } else {
                   res.send(401, JSON.stringify({error:"User does not exist."}));
               }
            });
        });
    }, signUp: function(req, res){
        res.setHeader('Content-Type', 'application/json');
        console.log("Signup attempt, user: "+req.body.username+" pwd: "+req.body.password);

        var user    = req.body.username;
        var pass    = req.body.password;
        var confirm = req.body.confirm;
        var email   = req.body.email;

        con.connect(function(err, db) {
            var collection = db.collection("users");
            collection.find({"username" : user}).toArray(function(err, item) {
                if(item.length) {
                    console.log("User already exists");
                    var response = {error:"User already exists."};
                    res.status(401).end(JSON.stringify(response));
                } else {
                    con.connect(function(err, db) {
                        console.log("inserting user");
                        collection.insert({
                            username: user,
                            password: pass,
                            role: USER_ROLES.guest,
                            email: email
                        }, function(err, users){
                            console.log(users);
                            var user = users[0];
                            var response = JSON.stringify({
                                id: user._id,
                                user: {
                                    name: user.username,
                                    role: user.role
                                }
                            });
                            res.send(response);
                        });
                    });
                }
            });
        });
    }
};

module.exports = methods;

