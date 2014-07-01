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


var app = angular.module("proShop",['ngRoute']);

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
        }).when('/account', {
            templateUrl: "partials/account.html",
            controller: "account"
        }).when('/error',{
            templateUrl: "partials/404.html",
            controller: "error"
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

app.factory("initModel",["$http","settings",function(h,s){
    var service = {};

    service.getSettings = function(m){
        m.settings = s;
    };

    service.getItem = function(m){
        h.get(s.fullPath()+"inventory/").success(function(data){
            m.items = data;
        }).error(function(data){
            console.error(data);
        });
    };
    return service;
}]);


app.factory("viewModel",["initModel",function(initModel){
    var m = {
        active: {
            home: true,
            buy: false,
            rent: false
        }
    };
    initModel.getSettings(m);
    //initModel.getItem(m);

    return m;
}]);


app.controller("main",["$scope","viewModel",function(s,m){
    s.m = m;
    setActive(m.active,"home");

    s.change = function(input){
        m.test = input;
    }

}]);


app.controller("buyItem",["$scope","viewModel","$http",function(s,m) {
    s.m = m;
    setActive(m.active, "buy");



}]);

app.controller("buy",["$scope","viewModel","$http",function(s,m,h){
    s.m = m;
    setActive(m.active,"buy");

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
    setActive(m.active, "rent");

}]);

app.controller("cart",["$scope","viewModel",function(s, m){
    s.m = m;
    setActive(m.active);

    s.items = [{
		name: "Nike men's shirt fashionable",
		price: 10,
		qty: 3
		},
		{
		name: "Adidas women's pants trendy",
		price: 5,
		qty:1
		}];

	s.total = function(item){
		item.total = item.qty * item.price;
	}
	for(var i = 0; i < s.items.length; i++){
		s.total(s.items[i]);
	}

}]);


app.controller("error",["$scope","viewModel",function(s,m){
    s.m = m;
    s.error = {};
    s.error.display = decodeURIComponent(urlParams()["d"]);
}]);