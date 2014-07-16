
// https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
var app = angular.module("AuthService",["ngCookies"]);

app.constant('AUTH_EVENTS',{
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
});

app.service('Session', ["$cookies",function (cookie) {
    this.create = function (sessionId, userId, userRole) {
        this.id       = cookie.session = sessionId;
        this.userId   = cookie.user    = userId;
        this.userRole = cookie.role    = userRole;
    };
    this.read = function(){ return {
        session: (cookie.session)? cookie.session: this.id,
        name:    (cookie.user)?    cookie.user:    this.userId,
        role:    (cookie.role)?    cookie.role:    this.userRole
    };};
    this.destroy = function () {
        this.id       = null; delete cookie["session"];
        this.userId   = null; delete cookie["user"];
        this.userRole = null; delete cookie["role"];
    };
    return this;
}]);

app.factory('AuthService', ["$http", "Session", "$cookies", function ($http, Session, cookie) {
    var authService = {};

    authService.logged = function() {
        if(Session.read().session) {
            return Session.read();
        }
    };

    authService.login = function (credentials) {
        return $http.post('/login', credentials)
            .then(function (res) {
                if(res.hasOwnProperty('data'))
                    Session.create(res.data.id, res.data.user.name, res.data.user.role);
                return Session.read();
            });
    };
    authService.logout = function () {
        Session.destroy();
        return Session.read();
    };
    authService.signUp = function (credentials) {
        return $http.post('/signUp', credentials)
            .then(function (res) {
                if(res.hasOwnProperty('data'))
                    Session.create(res.data.id, res.data.user.name, res.data.user.role);
                return Session.read();
            });
    };

    authService.isAuthenticated = function () {
        return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authService;
}]);
