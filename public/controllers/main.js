/**
 * @description Checks if the variable exists
 * @param q
 * @returns {boolean}
 */
function exists(q){ return (typeof q!="undefined"&&q!=null);}
/**
 * @descriptionWrapper for the console.log function so that we can use it, and leave it in for development/production
 * @param message
 */
function log(message){if ( window.console && window.console.log ) {console.log(message);}}
function setActive(list, active){
    angular.forEach(list, function (page,key) {
        list[key] = false;
    });
    if(list.hasOwnProperty(active))
        list[active] = true;
}
function urlParams(v) {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&#]*)/gi, function (m, key, value) {
        vars[key]?vars[key]=vars[key]+','+value:vars[key]=value;
    });
    if (v) return vars[v]; else return vars;
}

var app = angular.module("proShop",['ngRoute', 'ngCookies', 'AuthService']);

app.config(['$routeProvider',
    function(r){
        r.when('/home', {
            templateUrl: "partials/home.html",
            controller: "main"
        }).when('/buy', {
            templateUrl: "partials/buy/buy.html",
            controller: "buy"
        }).when('/buy/:id', {
            templateUrl: "partials/buy/item.html",
            controller: "buyItem"
        }).when('/rent',{
            templateUrl: "partials/rent.html",
            controller: "rent"
        }).when('/cart', {
            templateUrl: "partials/cart.html",
            controller: "cart"
        }).when('/login', {
            templateUrl: "partials/login.html",
            controller: "login"
        }).when('/login/:success', {
            templateUrl: "partials/login.html",
            controller: "login"
        }).when('/logout', {
            templateUrl: "partials/logout.html",
            controller: "logout"
        }).when('/signUp', {
            templateUrl: "partials/signUp.html",
            controller: "signUp"
        }).when('/account', {
            templateUrl: "partials/account.html",
            controller: "account"
        }).when('/error',{
            templateUrl: "partials/404.html",
            controller: "error"
        }).when('/terms',{
            templateUrl: "partials/terms.html",
            controller: "terms"
        }).otherwise({
            redirectTo: 'home'
        });
    }]);

app.factory("settings",[function(){
    return {
        host: "http://localhost",
        port: "/",
        fullPath: function(){return this.host+this.port;},
        webSiteName: "CGGA ProShop",
        projectName: "ProShop",
        authors: [{
                name: "Brandon Couts",
                em: "carbondonuts@gmail.com"
            },{
                name: "Steve Carroll",
                em: ""
            },{
                name: "Garry Cronyn",
                em:""
            }
        ]
    };
}]);


app.factory("viewModel",[function(){
    var m = {
        active: {},
        setActive: function(list, active) {
            angular.forEach(list, function (page, key) {
                list[key] = false;
            });
            list[active] = true;
        }
    };
    return m;
}]);


app.controller("main",["$scope", "viewModel", "$location", "USER_ROLES", "AuthService", function(s, m, l, USER_ROLES, AuthService){
    s.m = m;
    m.setActive(m.active,"home");

    s.currentUser = null;
    s.userRoles = USER_ROLES;
    s.isAuthorized = AuthService.isAuthorized;

    s.setCurrentUser = function(user) { s.currentUser = user; };
    s.logout = function() {
        AuthService.logout();
        s.currentUser = null;
        l.path("/login/success");
    };
}]);


app.controller("buyItem",["$scope","viewModel","$http","$routeParams",function(s, m, h, params) {
    s.m = m;
    m.setActive(m.active, "buy");
    h.get("/r/inventory/"+params.item)
        .success(function(data){
            s.item = data;
        }).error(function(data){
            // error
        });


}]);

app.controller("buy",["$scope","viewModel","$http",function(s,m,h){
    s.m = m;
    m.setActive(m.active,"buy");

    s.view = {
        stack: true,
        list: false
    };

    s.getInventory = function(text) {
        console.log(typeof text);
        console.log(exists(text));
        if(exists(text) && text != "") {
            h.get("http://localhost:8080/r/inventory/" + text)
                .success(function (response) {
                    s.data = response;
                })
                .error(function () {
                });
        }
    };

    s.showView = function(type){
        setActive(s.view, type);
    };

    s.clickCategory = function(category){
        s.searchText = category.name;
        s.getInventory(s.searchText)
    };

    s.categories = [{name:"Clubs",members:[{name:"Iron",category:"Clubs"},{name:"Putters",Category:"Clubs"}]}];
    s.inventory = [{
        name:"Golf Club",
        price:10
    },{
        name:"Shirt",
        price:10
    },{
        name:"Shirt",
        price:10
    },{
        name:"Shirt",
        price:10
    },{
        name:"Shirt",
        price:10
    },{
        name:"Shirt",
        price:10
    },{
        name:"Shirt",
        price:10
    }];
}]);


app.controller("rent",["$scope","viewModel",function(s, m){
    s.m = m;
    m.setActive(m.active, "rent");

}]);

app.controller("cart",["$scope","viewModel",function(s, m){
    s.m = m;
    m.setActive(m.active, "cart");

}]);

app.controller("login",["$scope", "viewModel", "$routeParams", "$rootScope", "$location", "AUTH_EVENTS", "AuthService", function(s, m, p, r, l, AUTH_EVENTS, Auth) {
    s.m = m;
    s.error = {};
    if(p.success) {
        s.success = "Successfully logged out";
    }

    s.change = function(){ s.error = {}; };
    s.login = function(credentials) {
        Auth.login(credentials).then(function(user) {
            s.setCurrentUser(user); // r.$broadcast(AUTH_EVENTS.loginSuccess);
            l.path("/home");
        }, function(error) {
            if(error.status == 401) s.error.label = error.data.error;
            r.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
}]);

app.controller("signUp",["$scope", "viewModel", "$rootScope", "$location", "AUTH_EVENTS", "AuthService", function(s, m, r, l, AUTH_EVENTS, Auth) {
    s.m = m;
    s.error = {};

    s.change = function(){ s.error = {}; };
    s.signUp = function(credentials) {
        alert("Hey man! You want to sign up! That's cool. This isn't working just yet though- Sorry about that.");
        Auth.signUp(credentials).then(function(user) {
            s.setCurrentUser(user); // r.$broadcast(AUTH_EVENTS.loginSuccess);
            l.path("/home");
        }, function(error){
            if(error.status == 401) s.error.label = error.data.error;
            r.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
}]);

app.controller("error",["$scope","viewModel", function(s, m) {
    s.m = m;
    s.error = {};
    s.error.display = decodeURIComponent(urlParams()["d"]);
}]);

app.controller("account",["$scope","viewModel",function(s, m){
    s.m = m;
}]);