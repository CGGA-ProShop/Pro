var con = require("./../mongo");

var methods = {
    login: function(req, res){
        console.log("Login attempt, user: "+req.body.username+" pwd: "+req.body.password);
        var user = req.body.username;
        var pass = req.body.password;
        if(user.toLowerCase() === user.toLowerCase()) {
            if(pass === pass) {
                res.send(200, {id: 1, user: {name: user, role: USER_ROLES.admin}});
            } else {
                res.send(401, {error:"Password does not match."});
            }
        } else {
            res.send(401, {error:"User does not exist."});
        }
    }, signUp: function(req, res){
        console.log("Login attempt, user: "+req.body.username+" pwd: "+req.body.password);

        res.send({id: 1, user: {name: req.body.username, role: USER_ROLES.admin}});
        console.log(JSON.stringify({id: 1, user: {name: req.body.username, role: USER_ROLES.admin}}));
    }
};

module.exports = methods;

