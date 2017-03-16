"use strict";

controllers.controller('UserSetupController', 
    ['$rootScope', '$routeParams', '$location', '$scope', '$q', '$timeout', 'RoleRouteMap', 'User', 'LocalDBService', 'ValidateService', 
    function ($rootScope, $routeParams, $location, $scope, $q, $timeout, RoleRouteMap, User, LocalDB, Validate) {

    $rootScope.requireUI = true;

    $scope.Breadcrumb = [];

    var currentPath = $location.path(),
        locationPath = '';
    
    for (var path in currentPath.split('/')) {
        var pathVal = currentPath.split('/')[path];
        locationPath += pathVal + '/';

        if (pathVal) {
            $scope.Breadcrumb.push({ title: pathVal, locationPath: locationPath.substr(0, locationPath.length-1) });
        }
    }

    $scope.user = [];
    $scope.userData = {};

    $scope.userRoleOpionts = {
        model: {
            name: 'Role',
            method: 'get',
            lists: {
                id: 'role_id',
                text: 'role_title'
            }
        }
    };

    $scope.modalTitle = '';
    $scope.isNew = false;

    $scope.rules = {
        requires: [
            { id: 'usr_title', text: 'Title' },
            { id: 'usr_role_id', text: 'Role' }]
    };

    $scope.searchColumns = [{ id: 'usr_title', type: 'text', name: 'usr_title', title: 'Title' }];

    $scope.listing = {
        tHeader: [
            { id: 'usr_title', name: 'Title', action: {
                    type: 'function', name: 'openForm', param: 'usr_id'
                }},
            { id: 'role_title', name: 'Role' },
            { id: 'usr_active', name: 'Active', component: {
                    type: 'checkbox'
                }}
        ],
        tBody: [],
        options: {
            tools: [
                { type: 'delete', icon: 'delete', action: {
                    name: 'delete', param: 'usr_id'
                }},
                { type: 'edit', icon: 'create', action: {
                    name: 'openForm', param: 'usr_id'
                }}
            ]
        }
    };


    $scope.$watch('isNew', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            if (newVal === true) {
                $scope.rules.requires.push({ id: 'usr_passwd', text: 'Password' });
            } else {
                for (var i = 0; i < $scope.rules.requires.length; i++) {
                    if ($scope.rules.requires[i].id === 'usr_passwd') {
                        $scope.rules.requires.splice(i, 1);
                    }
                }
            }
        }
    });

    $scope.openForm = function (usrId) {
        if (typeof usrId !== 'undefined' && usrId !== null) {
            User.get({ usr_id: usrId}, function (user) {
                $scope.userData = user;
                $scope.modalTitle = '#' + user.usr_title;
                $scope.isNew = false;
            });
        } else {
            $scope.userData = new User();
            $scope.modalTitle = 'NEW USER';
            $scope.isNew = true;
        }
        $('#userModal').modal('show');
    };

    $scope.create = function (userData) {
        $scope.$emit('beginLoading', true);
        if (Validate.check(userData, $scope.rules) === true) {
            userData.$create().then(function (rs) {
                if (rs) {
                    noty({ theme: 'relax', type: 'success', text: 'Save successed.', timeout: 3000 });
                    _getUser();
                }
                $('#userModal').modal('hide');
                $scope.$emit('endLoading');
            });
        } else {
            $scope.$emit('endLoading');
        }
    };

    $scope.update = function (userData) {
        $scope.$emit('beginLoading', true);
        if (Validate.check(userData, $scope.rules) === true) {
            userData.$update().then(function (rs) {
                if (rs.result === true) {
                    noty({ theme: 'relax', type: 'success', text: 'Save successed.', timeout: 3000 });
                    _getUser();
                }
                $('#userModal').modal('hide');
                $scope.$emit('endLoading');
            }, function (err) {
                $('#userModal').modal('hide');
                $scope.$emit('endLoading');
                console.log(err);
            });
        } else {
            $scope.$emit('endLoading');
        }
    };

    $scope.delete = function (usrId) {

        noty({
            text: 'Delete this user, Do you want to continue?',
            buttons: [
                { 
                    addClass: 'btn btn-success', 
                    text: 'Ok', 
                    onClick: function($noty) {
                        $scope.$emit('beginLoading', true);

                        User.get({ usr_id: usrId}, function (user) {
                            if (user) {
                                user.$delete().then(function (rs) {
                                    if (rs.result === true) {
                                        noty({ theme: 'relax', type: 'success', text: 'This user was deleted.', timeout: 3000 });
                                        _getUser();
                                        $scope.$emit('endLoading');
                                    }
                                });
                            } else {
                                 _getUser();
                                $scope.$emit('endLoading');
                            }

                            $noty.close();
                        });
                    }
                }, {
                    addClass: 'btn btn-danger', 
                    text: 'Cancel', 
                    onClick: function($noty) {
                        $noty.close();
                    }
                }
            ]
        });
    }

    $scope.searches = function (searches) {
        _getUser(searches);
    };

    var _getUser = function (searches) {
        for (var prop in searches) {
            if (searches.hasOwnProperty(prop)) {
                if (searches[prop] === null) {
                    delete searches[prop];
                }
            }
        }
        console.log('User.search.searches: ', searches);
        User.search(searches, function (result) {
            $scope.listing.tBody = result.data;
            $scope.$emit('endLoading');
        });
    };

    $('#userModal').on('hide.bs.modal', function (e) {
        $scope.userData = {};
    });

    LocalDB.getBearerToken(function (rs) {
        $scope.$emit('beginLoading', true);
        if (rs.result === true) {
            RoleRouteMap.getAccessRoute({ route_path: $location.path() }, function (acr) {
                if (acr.data.length > 0) {
                    _getUser();
                } else {
                    $location.path('/');
                    $scope.$emit('endLoading');
                }
            });
        } else {
            $location.path('/');
            $scope.$emit('endLoading');
        }
    });
    

}]);