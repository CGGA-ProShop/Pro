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
        }).when('/pluggedIn', {
            templateUrl: "partials/pluggedin.html",
            controller: "pluggedIn"
        }).when('/checkout', {
            templateUrl: "partials/checkout.html",
            controller: "checkout"
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
            window.scrollTo(0,0);
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
            cartItem.itemId = cartItem._id;
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
                var discount = (item.buy)? 1 - item.discount : .1;
                total += price(item.price, item.qty, discount);
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

    // c.cartId = "";

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
        l.path("/checkout");
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

app.controller("checkout",["$scope", "viewModel", "$location","cart", "$cookies",function(s, m, l, cart, c){
    s.m = m;
    m.setActive(m.active);

    s.checkOut = function() {
        alert('That\'s as far as you go. Thank you for trying our website.');
        l.path("/home");
        cart.items = [];
        c.cartId = "";
    };

    s.states = [
        {
            "name": "Alabama",
            "abbreviation": "AL"
        },
        {
            "name": "Alaska",
            "abbreviation": "AK"
        },
        {
            "name": "American Samoa",
            "abbreviation": "AS"
        },
        {
            "name": "Arizona",
            "abbreviation": "AZ"
        },
        {
            "name": "Arkansas",
            "abbreviation": "AR"
        },
        {
            "name": "California",
            "abbreviation": "CA"
        },
        {
            "name": "Colorado",
            "abbreviation": "CO"
        },
        {
            "name": "Connecticut",
            "abbreviation": "CT"
        },
        {
            "name": "Delaware",
            "abbreviation": "DE"
        },
        {
            "name": "District Of Columbia",
            "abbreviation": "DC"
        },
        {
            "name": "Federated States Of Micronesia",
            "abbreviation": "FM"
        },
        {
            "name": "Florida",
            "abbreviation": "FL"
        },
        {
            "name": "Georgia",
            "abbreviation": "GA"
        },
        {
            "name": "Guam",
            "abbreviation": "GU"
        },
        {
            "name": "Hawaii",
            "abbreviation": "HI"
        },
        {
            "name": "Idaho",
            "abbreviation": "ID"
        },
        {
            "name": "Illinois",
            "abbreviation": "IL"
        },
        {
            "name": "Indiana",
            "abbreviation": "IN"
        },
        {
            "name": "Iowa",
            "abbreviation": "IA"
        },
        {
            "name": "Kansas",
            "abbreviation": "KS"
        },
        {
            "name": "Kentucky",
            "abbreviation": "KY"
        },
        {
            "name": "Louisiana",
            "abbreviation": "LA"
        },
        {
            "name": "Maine",
            "abbreviation": "ME"
        },
        {
            "name": "Marshall Islands",
            "abbreviation": "MH"
        },
        {
            "name": "Maryland",
            "abbreviation": "MD"
        },
        {
            "name": "Massachusetts",
            "abbreviation": "MA"
        },
        {
            "name": "Michigan",
            "abbreviation": "MI"
        },
        {
            "name": "Minnesota",
            "abbreviation": "MN"
        },
        {
            "name": "Mississippi",
            "abbreviation": "MS"
        },
        {
            "name": "Missouri",
            "abbreviation": "MO"
        },
        {
            "name": "Montana",
            "abbreviation": "MT"
        },
        {
            "name": "Nebraska",
            "abbreviation": "NE"
        },
        {
            "name": "Nevada",
            "abbreviation": "NV"
        },
        {
            "name": "New Hampshire",
            "abbreviation": "NH"
        },
        {
            "name": "New Jersey",
            "abbreviation": "NJ"
        },
        {
            "name": "New Mexico",
            "abbreviation": "NM"
        },
        {
            "name": "New York",
            "abbreviation": "NY"
        },
        {
            "name": "North Carolina",
            "abbreviation": "NC"
        },
        {
            "name": "North Dakota",
            "abbreviation": "ND"
        },
        {
            "name": "Northern Mariana Islands",
            "abbreviation": "MP"
        },
        {
            "name": "Ohio",
            "abbreviation": "OH"
        },
        {
            "name": "Oklahoma",
            "abbreviation": "OK"
        },
        {
            "name": "Oregon",
            "abbreviation": "OR"
        },
        {
            "name": "Palau",
            "abbreviation": "PW"
        },
        {
            "name": "Pennsylvania",
            "abbreviation": "PA"
        },
        {
            "name": "Puerto Rico",
            "abbreviation": "PR"
        },
        {
            "name": "Rhode Island",
            "abbreviation": "RI"
        },
        {
            "name": "South Carolina",
            "abbreviation": "SC"
        },
        {
            "name": "South Dakota",
            "abbreviation": "SD"
        },
        {
            "name": "Tennessee",
            "abbreviation": "TN"
        },
        {
            "name": "Texas",
            "abbreviation": "TX"
        },
        {
            "name": "Utah",
            "abbreviation": "UT"
        },
        {
            "name": "Vermont",
            "abbreviation": "VT"
        },
        {
            "name": "Virgin Islands",
            "abbreviation": "VI"
        },
        {
            "name": "Virginia",
            "abbreviation": "VA"
        },
        {
            "name": "Washington",
            "abbreviation": "WA"
        },
        {
            "name": "West Virginia",
            "abbreviation": "WV"
        },
        {
            "name": "Wisconsin",
            "abbreviation": "WI"
        },
        {
            "name": "Wyoming",
            "abbreviation": "WY"
        }
    ];

    s.cardTypes = [{name:"InYourDreams"},{name:"FastCard"},{name:"UberSwipe"}];
    s.months = [{name:"01"},{name:"02"},{name:"03"},{name:"04"},{name:"05"},{name:"06"},{name:"07"},{name:"08"},{name:"09"},{name:"10"},{name:"11"},{name:"12"}];
    s.years = [{name:"2014"},{name:"2015"},{name:"2016"},{name:"2017"},{name:"2018"},{name:"2019"},{name:"2020"},{name:"2021"},{name:"2022"},{name:"2023"},{name:"2024"},{name:"2025"},{name:"2026"},{name:"2027"},{name:"2028"},{name:"2029"},{name:"2030"}];
}]);

app.controller("pluggedIn",["$scope", "viewModel", "$location","cart", "$cookies",function(s, m, l, cart, c) {
    s.m = m;
    m.setActive(m.active);


}]);