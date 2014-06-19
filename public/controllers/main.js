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
        }).when('/error',{
            templateUrl: "partials/404.html",
            controller: "main"
        }).otherwise({
            redirectTo: 'home'
        });
    }]);

app.service("initModel",["$http",function(h){
    this.getItem = function(m){
        h.get("http://localhost:8888/").success(function(data){
            m.items = data;
        });
    };
}]);


app.factory("viewModel",["initModel",function(initModel){
    var returnBack = {items:""};

    initModel.getItem(returnBack);

    return {
        settings:{
            webSiteName:"CGGA"
        },
        items: returnBack.items
    };
}]);


app.controller("main",["$scope","viewModel",function(s,m){
    s.m = m;
    m.test = "Hello steve";

    s.change = function(input){
        m.test = input;
    }

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