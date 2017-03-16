"use strict";

controllers.controller('LoginController', 
    ['$rootScope', '$routeParams', '$location', '$scope', '$q', '$timeout', 'LoginService', 'LocalDBService', 'User',
    function ($rootScope, $routeParams, $location, $scope, $q, $timeout, LoginService, LocalDB, User) {

    $rootScope.requireUI = false;

    var _goToHomePage = function () {
        User.getHomePage(function (user) {
            if (user) {
                $location.path(user.Role.role_home_path);
            }
        });
    };

    $scope.login = function (data) {
        LoginService.login(data.username, data.passwd).then(function (rs) {
            if (rs.result === true) {
                LocalDB.setBearerToken(rs.bearerToken, rs.expiresIn, function (rs) {
                    $timeout(function () {
                        _goToHomePage();
                    });
                });
            }
        }, function (err) {
            // NotyHelper.displayError(err);
            noty({ theme: 'relax', type: 'warning', text: 'Username or password is incorrect!', timeout: 3000 });
        });
    };

}]);