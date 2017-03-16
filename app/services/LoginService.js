"use strict";

/**
 * @class LoginService
 * @description Service for user authentication
 * @memberof XeerSoft.app.services.core
 * @see
 * ui/partials/core/LoginView.html
 * app/controllers/core/LoginCtrl.js
 */
services.service('LoginService', ['$q', '$http', '$cookieStore', function ($q, $http, $cookieStore) {
    var self = this;

    /**
     * @public
     * @static
     * @function login
     * @memberof XeerSoft.app.services.LoginService
     * @param {string} username
     * @param {string} password
     * @return {promise}
     * @example {@lang json}
     * { result: false, status: 404, message: "User not found" }
     */
    self.login = function (username, password) {
        var deferred = $q.defer();
        $http.post('/oauth/token', {
            grant_type: 'client_credentials',
            client_id: 1,
            client_secret: username + ':' + password
        }).success(function (data, status) {
            if (status === 200 && data.access_token !== undefined) {
                self.bearerToken = data.access_token;
                $http.defaults.headers.common.Authorization = 'Bearer ' + self.bearerToken;

                deferred.resolve({result: true, bearerToken: self.bearerToken, expiresIn: data.expires_in });
            }
        }).error(function (data, status) {
            if (status === 0) {
                deferred.reject({result: false, status: status, statusText: 'Cannot connect to server'});
            } else if (status === -1 && data === null) {
                deferred.reject({result: false, status: status, statusText: 'Connection refused'});
            } else {
                var errMessage = (data !== null && typeof data.error_description !== 'undefined') ? data.error_description : 'Unknown error';
                deferred.reject({result: false, status: status, statusText: errMessage});
            }

        });

        return deferred.promise;
    };
}]);
