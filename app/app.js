"use strict";

// var jazz = require('jazz-midi');
// var midi = new jazz.MIDI();

var app = angular.module('app', [
    'angularAwesomeSlider',
    'angularUtils.directives.dirPagination',
    'camelCaseToHuman',
    'datetimepicker',
    'ngAnimate',
    'ngCookies',
    'ngCordova',
    'ngRoute',
    'ngResource',
    'oitozero.ngSweetAlert',
    'app.directives',
    'app.services',
    'app.factories',
    'app.controllers',
    'ui.bootstrap'
]);

var directives = angular.module('app.directives', []),
    services = angular.module('app.services', []),
    factories = angular.module('app.factories', []),
    controllers = angular.module('app.controllers', []);

app.config(['$routeProvider', '$httpProvider', '$resourceProvider', function ($routeProvider, $httpProvider, $resourceProvider) {
    // HTTP Request setup
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
        var key, result = [];
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
        }
        return result.join("&");
    });

    // Resource setup
    $resourceProvider.defaults.stripTrailingSlashes = false;

    ExampleRoute.setup($routeProvider);
    AdminRoute.setup($routeProvider);
    FrontRoute.setup($routeProvider);

    $httpProvider.interceptors.push(['$q', '$rootScope', '$injector', function ($q, $rootScope, $injector) {
        return {
            // This is the responseError interceptor
            responseError: function (rejection) {
                // console.log('rejection: ', rejection);
                if (rejection.status === 500 && rejection.data.code === 500 && rejection.data.error && rejection.data.error_description) {
                    // Server error and return proper response, then display to User
                    return $q(function(resolve, reject) {
                        noty({
                            modal: true,
                            type: 'error',
                            text: rejection.data.error_description,
                            buttons: [
                                {
                                    addClass: 'btn btn-primary',
                                    text: 'Reload this page',
                                    onClick: function ($noty) {
                                        $noty.close();
                                        reject($q.reject(rejection));
                                        $injector.get('$window').location.reload();
                                    }
                                }
                            ]
                        });
                    });
                } else if (rejection.status === 500 && /OAuth2Error/g.test(rejection.data)) {
                    return $q(function(resolve, reject) {
                        noty({
                            modal: true,
                            type: 'error',
                            text: 'The access token provided has expired.',
                            callback: {
                                afterShow: function () {
                                    $rootScope.logout();
                                }
                            }
                        });
                    });
                } else if (rejection.data.code === 401 && rejection.data.error === 'invalid_token') {
                    return $q(function(resolve, reject) {
                        noty({
                            modal: true,
                            type: 'error',
                            text: rejection.data.error_description,
                            callback: {
                                afterShow: function () {
                                    $rootScope.logout();
                                }
                            }
                        });
                    });
                }

                // If not any case above, do nothing with this error and pass rejection to its caller
                return $q.reject(rejection);
            }
        };
    }]);
}]);

app.run(['$rootScope', '$http', '$location', '$route', '$timeout', 'LocalDBService', function ($rootScope, $http, $location, $route, $timeout, LocalDB) {
    $rootScope.requireUI = false;
    $rootScope.navBottom = false;
    $rootScope.midiSetting = false;
    $rootScope.midiSettingMenu = false;
    $rootScope.disableMidiOut = false;
    $rootScope.toggled = false;
    
    $rootScope.sidebar = [
        { name: 'Lessons', path: '/'},
        { name: 'Ear Training', path: '/EarTraining/ChordProgressions'},
        { name: 'My Profile', path: '/MyProfile'},
        { name: 'Logout', path: '/'}
    ];

    var getBearerToken_handler = function (rs) {
        // console.log('getBearerToken_handler: ', rs);
        try {
            if (rs.result !== true) {
                noty({type: 'warn', text: 'Session expired. Please re-login.', timeout: 3000});
                $rootScope.logout();
            }
        } catch (e) {
            console.log('getBearerToken_handler: ', e);
            $rootScope.logout();
        }
            
    };

    $rootScope.sideBarToggle = function (elm) {
        // console.log('========sideBarToggle=======');
        if (typeof elm === 'undefined') {
            elm.preventDefault();
        }
        
        $('#wrapper').toggleClass('toggled');
        // console.log('$location.path(): ', $location.path());
        // console.log($('#wrapper').hasClass('toggled'));
        if ($('#wrapper').hasClass('toggled')) {
            $timeout(function () {
                $rootScope.sideBarToggle(elm);
            }, 5000);
        }
    };

    $rootScope.redirectTo = function (path, params) {
        var asignpath;

        if (typeof path !== 'undefined') {
            asignpath = path
        } else {
            asignpath = '/';
        }

        if (typeof params !== 'undefined') {
            asignpath = asignpath + '/' + params;
        }

        $timeout(function () {
            $location.path(asignpath);
        });
    };

    $rootScope.logout = function (msg) {
        if (typeof msg === 'string' && msg !== '') {
            noty({
                text: msg,
                type: 'warn',
                timeout: 3000
            });
        }

        LocalDB.deleteUserData(function () {
            $http.get('/Logout');
            $location.path('Login');
            // $rootScope.sideBarToggle(false);
            // if ($('#wrapper').hasClass('toggled')) {
            //     $('#wrapper').removeClass();
            // }
            // $rootScope.sideBarToggle();
        });
    };

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        try {
            if (next.templateUrl !== 'partials/login.html') {
                LocalDB.getBearerToken(getBearerToken_handler);
            }
        } catch (e) {
            console.log(e);
        }
    });

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.$emit('endLoading');
    });
}]);

