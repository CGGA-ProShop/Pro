var app = angular.module("proShop",['ngRoute']);

app.config(['$routeProvider',
    function(r){
        r.when('/home', {
            templateUrl: "partials/home.html",
            controller: "main"
        }).when('/buy', {
            templateUrl: "partials/buy.html",
            controller: "buy"
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

app.controller("buy",["$scope","viewModel","$http",function(s,m,h){

    s.getInventory = function(text) {
        h.get("http://localhost:8888/inventory/"+text)
            .success(function (response) {
                s.data = response;
            })
            .error(function () {
            });
    };

    s.m = {settings:{webSiteName:"CGGA Proshop"}};
    s.inventory = [{
        name:"Golf Club",
        price:10
    },{
        name:"Shirt",
        price:10
    }];
}]);