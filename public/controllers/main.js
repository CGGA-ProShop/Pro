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
            controller: "main"
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
            controller: "main"
        }).otherwise({
            redirectTo: 'home'
        });
    }]);

app.factory("settings",[function(){
    return {
        host: "http://localhost",
        port: "/",
        fullPath: function(){return this.host+this.port;},
        webSiteName: "CGGA",
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
    var m = {};

    m.getSettings = function(m){
        m.settings = s;
    };

    m.getItem = function(m){
        h.get(s.fullPath()+"inventory/").success(function(data){
            m.items = data;
        });
    };
    return m;
}]);


app.factory("viewModel",["initModel",function(initModel){
    var m = {

    };
    initModel.getSettings(m);
    initModel.getItem(m);

    return m;
}]);


app.controller("main",["$scope","viewModel",function(s,m){
    s.m = m;

    s.change = function(input){
        m.test = input;
    }

}]);

app.controller("cart",["$scope",function(s){
    s.m = m;

}]);

app.controller("buyItem",["$scope","viewModel","$http",function(s,m,h) {

}]);

app.controller("buy",["$scope","viewModel","$http",function(s,m,h){
    s.view = {
        stack: true,
        list: false
    };

    s.getInventory = function(text) {
        console.log(typeof text);
        console.log(exists(text));
        if(exists(text) && text != "") {
            h.get("http://localhost:8888/inventory/" + text)
                .success(function (response) {
                    s.data = response;
                })
                .error(function () {
                });
        }
    };
    h.get()
        .success(function(){

        })
        .error(function(){

        });
    s.showView = function(type){
        if(s.view.hasOwnProperty(type)){
            for(var view in s.view){
                if(s.view.hasOwnProperty(view))
                    s.view[view] = false;
            }
            s.view[type] = true;
        }
    };

    s.categories = [{name:"Clubs",members:[{name:"Iron",category:"Clubs"},{name:"Putters",Category:"Clubs"}]}];

    s.clickCategory = function(category){
        s.searchText = category.name;
        s.getInventory(s.searchText)
    };

    s.m = {settings:{webSiteName:"CGGA Proshop"}};
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