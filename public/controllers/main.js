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

var app = angular.module("proShop",['ngRoute', 'AuthService']);

app.config(['$routeProvider',
    function(r){
        r.when('/home', {
            templateUrl: "partials/home.html",
            controller: "main"
        }).when('/buy', {
            templateUrl: "partials/buy/buy.html",
            controller: "buy"
        }).when('/buy/:category', {
            templateUrl: "partials/buy/buy.html",
            controller: "buy"
        }).when('/item/:id',{
            templateUrl: "partials/buy/item.html",
            controller: "buyItem"
        }).when('/cart', {
            templateUrl: "partials/cart.html",
            controller: "cart"
        }).when('/login', {
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


app.factory("viewModel",["$location", "$anchorScroll",function(l, a){
    return {
        active: {},
        setActive: function(list, active) {
            l.hash("top");
            a();
            angular.forEach(list, function (page, key) {
                list[key] = false;
            });
            list[active] = true;
        }
    };
}]);


app.controller("main",["$scope", "viewModel", "$location", "USER_ROLES", "AuthService", function(s, m, l, USER_ROLES, AuthService){
    m.setActive(m.active,"home");
    s.m = m;

    s.currentUser = AuthService.logged();
    s.userRoles = USER_ROLES;
    s.isAuthorized = AuthService.isAuthorized;

    s.cart = [];
    s.inventory = [];

    s.setCurrentUser = function(user) { s.currentUser = user; };
    s.logout = function() {
        AuthService.logout();
        s.currentUser = AuthService.logged();
        l.path("/login");
    };
}]);


app.controller("buyItem",["$scope","viewModel","$http","$location","$routeParams",function(s, m, h, l, params) {
    m.setActive(m.active, "buy");
    s.m = m;
    log(params.id);
    h.get("/r/item/"+params.id).success(function(data){
        log(data);
        s.item = data;
    }).error(function(data){});

    s.discountPrice = function(item) {
        return (parseFloat(item.price) *.75).toFixed(2);
    };
    s.rentPrice = function(item) {
        return (parseFloat(item.price)*.1).toFixed(2);
    };
    s.addToCart = function(item, qty, buyOrRent) {
        log("Adding to cart: "+item.name+" Qty: "+qty);
        var cartItem = angular.copy(item);
        cartItem.user = s.currentUser;
        cartItem.qty = qty;
        cartItem.buy = buyOrRent;
        var holder = {item: cartItem};
        s.cart.push(cartItem);
        h.post("cart/", holder).success(function(data){

        }).error(function(data){

        });
        log(cartItem);
        l.path("/cart");
    };
}]);

app.controller("buy",["$scope","viewModel", "$http", "$routeParams",function(s, m, h, p) {
    m.setActive(m.active,"buy");
    s.m = m;

    if(p.category) {
        s.searchText = p.category;
    }

    h.get("r/items/").success( function(data){
        s.inventory = data;
    });

    s.display = function(item) { // Shortens the string nicely to fit a certain length
        var display = item.name;
        var maxLength = 40;
        if(item.name.length > maxLength) {
            display = "";
            var split = item.name.split(" ");
            var length = split.length;
            for(var i = 0; i < length; i++){
                if(display.length + split[i].length + 1 <= maxLength) {
                    display += " " + split[i];
                }
            }
            display += "...";
        }
        return display;
    };

    s.displayPrice = function(item) {
        var price = item.price;
        return (parseInt(price)).toFixed(2);
    };

    s.getInventory = function(text) {
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
}]);

app.controller("cart",["$scope", "viewModel", "$location", function(s, m, l){
    m.setActive(m.active, "cart");
    s.m = m;

    s.checkOut = function() {
        l.path("/shipping");
    };

    s.numItems = function() {
        var length = s.cart.length, total = 0;
        for(var i = 0; i < length; i++) {
            total += s.cart[i].qty;
        }
        return total;
    };

    s.total = function() {
        var length = s.cart.length, total = 0;
        for(var i = 0; i < length; i++) {
            total += s.cart[i].qty * s.cart[i].price;
        }
        return total.toFixed(2);
    };

    s.deleteItem = function(item) {
        s.cart.splice(s.cart.indexOf(item), 1);
    };
}]);

app.controller("login",["$scope", "viewModel", "$routeParams", "$rootScope", "$location", "AUTH_EVENTS", "AuthService", function(s, m, p, r, l, AUTH_EVENTS, Auth) {
    m.setActive(m.active);
    s.m = m;
    s.error = {};
    s.credentials = {username:"",password:""};


    s.change = function(){ s.error = {}; };
    s.login = function(credentials) {
        Auth.login(credentials).then(function(user) {
            s.setCurrentUser(user); // r.$broadcast(AUTH_EVENTS.loginSuccess);
            l.path("/home");
            credentials.password = "";
        }, function(error) {
            if(error.status == 401) s.error.label = error.data.error;
            r.$broadcast(AUTH_EVENTS.loginFailed);
            credentials.password = "";
        });
    };
}]);

app.controller("signUp",["$scope", "viewModel", "$rootScope", "$location", "AUTH_EVENTS", "AuthService", function(s, m, r, l, AUTH_EVENTS, Auth) {
    s.m = m;
    s.error = {};
    m.setActive(m.active);

    s.change = function(){ s.error = {}; };
    s.match = function(){
        if( s.credentials.password &&
            s.credentials.confirm &&
            s.credentials.password != "" &&
            s.credentials.confirm != "" &&
            s.credentials.password != s.credentials.confirm){
            s.error.error = "The passwords do not match.";
            s.error.password = true;
            s.error.confirm = true;
        } else {
            s.error.error = "";
            s.error.password = false;
            s.error.confirm = false;
        }
    };
    s.signUp = function(credentials) {
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
    m.setActive(m.active);
    s.error.display = decodeURIComponent(urlParams()["d"]);
}]);

app.controller("account",["$scope","viewModel",function(s, m){
    s.m = m;
    m.setActive(m.active);
}]);