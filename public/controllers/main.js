/**
 * @description Checks if the variable exists
 * @param q
 * @returns {boolean}
 */
function exists(q){ return (typeof q!="undefined"&&q!=null);}
/**
 * @descriptionWrapper for the console.console.log function so that we can use it, and leave it in for development/production
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

var app = angular.module("proShop",['ngRoute', 'AuthService', 'ngCookies']);

app.config(['$routeProvider',
    function(r){
        r.when('/home', {
            templateUrl: "partials/home.html",
            controller: "home"
        }).when('/buy', {
            templateUrl: "partials/buy/buy.html",
            controller: "buy"
        }).when('/buy/:category', {
            templateUrl: "partials/buy/buy.html",
            controller: "buy"
        }).when('/buy/:category/:type', {
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
        }).when('/disclaimer',{
            templateUrl: "partials/disclaimer.html",
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
            angular.forEach(list, function (page, key) {
                list[key] = false;
            });
            list[active] = true;
        }
    };
}]);


app.factory("cart",["$http", "AuthService", "$cookies", function(h, a, c){
    function price(price, qty, discount) {
        return price * qty * discount;
    }
    return {
        items: [],
        get: function() {
            return this.items;
        }, add: function (item, qty, buyOrRent) {
            console.log("Adding to cart: " + item.name + " Qty: " + qty);
            var cartItem = angular.copy(item);
            cartItem.qty = qty;
            cartItem.buy = buyOrRent;
            cartItem.user = a.logged();
            this.items.push(cartItem);
            h.post("cart/", {item: cartItem}).success(function (data) {
                console.log(data);
                data = data.replace(/\"/g,"");
                c.cartId = (c.cartId)? c.cartId +","+data : data;
            }).error(function (data) {
            });
        }, deleteItem: function(item) {
            this.items.splice(this.items.indexOf(item), 1);
            var list = c.cartId.split(',');
            list.splice(list.indexOf(item.cartId),1);
            c.cartId = "";
            angular.forEach(list, function(id){
                c.cartId = (c.cartId)? c.cartId +","+id : id;
            });
            console.log(c.cartId);
        }, updateItem: function(item) {
            h.post("/u/cart/", {item: item})
                .success(function(item){

                }).error();
        }, rent: function(item, qty){
            if(item && item.hasOwnProperty("price") && item.price)
                return (parseFloat(item.price) * .1 * qty).toFixed(2);
            else
                return "";
        }, price: function(item, qty) {
            return (item && item.hasOwnProperty("price") && item.price)? (parseFloat(item.price) * (1 - parseFloat(item.discount)) * qty).toFixed(2): "";
        }, total: function() {
            var total = 0;
            angular.forEach(this.items, function (item) {
                total += price(item.price, item.qty, 1 - item.discount);
            });
            return (total).toFixed(2);
        }, count: function() {
            var total = 0;
            angular.forEach(this.items, function(item){
                total += item.qty;
            });
            return total;
        }, discount: function(item) {
            return (item)?(parseFloat(item.discount) * 100).toFixed(0):"";
        }, display : function(item, maxLength) { // Shortens the string nicely to fit a certain length
            var display = item;
            if(item.length > maxLength) {
                display = "";
                var split = item.split(" ");
                var length = split.length;
                for(var i = 0; i < length; i++){
                    if(display.length + split[i].length + 1 <= maxLength) {
                        display += " " + split[i];
                    }
                }
                display += "...";
            }
            return display;
        }
    }
}]);


app.controller("home",["$scope", "viewModel", "cart", "$http", "$timeout", function(s, m, cart, h, t){
    m.setActive(m.active,"home");
    s.m = m;

    s.flash = true;
    function flash() {s.flash = !s.flash; t(flash,1000);}
    t(flash,250);

    h.get("/r/deals/")
        .success(function(data){
            s.deals = data;
        })
        .error();
}]);


app.controller("main",["$scope", "viewModel", "$location", "USER_ROLES", "AuthService", "cart", "$http", "$cookies", function(s, m, l, USER_ROLES, AuthService, cart, h, c){
    m.setActive(m.active,"home");
    s.m = m;

    s.currentUser = AuthService.logged();
    s.userRoles = USER_ROLES;
    s.isAuthorized = AuthService.isAuthorized;

    s.cart = cart;
    s.inventory = [];
    s.categories = [];
    s.types = [];
    s.loading = true;

    //c.cartId = "";

    if(c.cartId){
        console.log(c.cartId);
        h.post('/r/cart/',{items: c.cartId}).success(function(data){
            cart.items = data;
            console.log(data);
        });
    }

    h.get("/r/items/").success(function(data){
        s.inventory = data;
        s.loading = false;
    });


    h.get("/r/categories/").success( function(data){
        s.types = data;
        var length = s.types.length;
        for(var i = 0; i < length; i++) {
            var l = s.categories.length;
            var unique = true;
            for(var j = 0; j < l; j++) {
                if(s.types[i].category == s.categories[j]) {
                    unique = false;
                    break;
                }
            }
            if(unique)
                s.categories.push(s.types[i].category);
        }
    });


    s.setCurrentUser = function(user) { s.currentUser = user; };
    s.logout = function() {
        AuthService.logout();
        s.currentUser = AuthService.logged();
        l.path("/login");
    };
}]);


app.controller("buyItem",["$scope","viewModel","$http","$location","$routeParams",function(s, m, h, l, params) {
    m.setActive(m.active, "buy"); console.log(params.id);
    s.m = m;

    h.get("/r/item/"+params.id).success(function(data){
        console.log(data);
        s.item = data;
    }).error(function(data){});

    s.addToCart = function(item, rentQty, buy){
        console.log("Adding the item");
        console.log(item);
        s.cart.add(item, rentQty, buy);
        console.log(s.cart.get());
        l.path("/cart");
    };
}]);

app.controller("buy",["$scope","viewModel", "$http", "$routeParams",function(s, m, h, p) {
    m.setActive(m.active,"buy");
    s.m = m;

    if(p.category) { s.searchCategory = p.category; }
    if(p.type) {
        s.searchType = p.type;
        if(p.type == "Pull-Push Carts")
            s.searchType = "Pull/Push Carts"
        if(p.type == "Stand-Carry Bags")
            s.searchType = "Stand/Carry Bags"
    }

    s.showView = function(view) {
        m.setActive(s.view, view);
    };
}]);

app.controller("cart",["$scope", "viewModel", "$location", "cart", function(s, m, l, cart){
    m.setActive(m.active, "cart");
    s.m = m;
    s.checkOut = function() {
        l.path("/shipping");
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