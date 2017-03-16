"use strict";

controllers.controller('LessonGroupSetupController', 
    ['$rootScope', '$routeParams', '$location', '$scope', '$q', '$timeout', 'RoleRouteMap', 'LessonGroup', 'LocalDBService', 'ValidateService', 
    function ($rootScope, $routeParams, $location, $scope, $q, $timeout, RoleRouteMap, LessonGroup, LocalDB, Validate) {

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

    $scope.lessonGroup = [];
    $scope.lessonGroupData = {};

    $scope.modalTitle = '';
    $scope.isNew = false;

    $scope.rules = {
        requires: [{ id: 'lsg_title', text: 'Title' }]
    };

    $scope.searchColumns = [{ id: 'lsg_title', type: 'text', name: 'lsg_title', title: 'Title' }];

    $scope.listing = {
        tHeader: [
            { id: 'lsg_title', name: 'Title', action: {
                    type: 'function', name: 'openForm', param: 'lsg_id'
                }},
            { id: 'lsg_description', name: 'Description' },
            { id: 'lsg_active', name: 'Active', component: {
                    type: 'checkbox'
                }}
        ],
        tBody: [],
        options: {
            tools: [
                { type: 'delete', icon: 'delete', action: {
                    name: 'delete', param: 'lsg_id'
                }},
                { type: 'edit', icon: 'create', action: {
                    name: 'openForm', param: 'lsg_id'
                }}
            ]
        }
    };

    $scope.openForm = function (lsgId) {
        if (typeof lsgId !== 'undefined' && lsgId !== null) {
            LessonGroup.get({ lsg_id: lsgId}, function (lsGrpData) {
                $scope.lessonGroupData = lsGrpData;
                $scope.modalTitle = '#' + lsGrpData.lsg_title;
                $scope.isNew = false;
            });
        } else {
            $scope.lessonGroupData = new LessonGroup();
            $scope.modalTitle = 'NEW LESSON GROUP';
            $scope.isNew = true;
        }
        $('#lessonGroupModal').modal('show');
    };
    // $scope.$on('openForm', $scope.openForm);


    $scope.create = function (lessonGroupData) {
        $scope.$emit('beginLoading', true);
        if (Validate.check(lessonGroupData, $scope.rules) === true) {
            lessonGroupData.$create().then(function (rs) {
                if (rs) {
                    noty({ theme: 'relax', type: 'success', text: 'Save successed.', timeout: 3000 });
                    _getLessonGroup();
                }
                $('#lessonGroupModal').modal('hide');
                $scope.$emit('endLoading');
            });
        } else {
            $scope.$emit('endLoading');
        }
    };

    $scope.update = function (lessonGroupData) {
        $scope.$emit('beginLoading', true);
        if (Validate.check(lessonGroupData, $scope.rules) === true) {
            lessonGroupData.$update().then(function (rs) {
                if (rs.result === true) {
                    noty({ theme: 'relax', type: 'success', text: 'Save successed.', timeout: 3000 });
                    _getLessonGroup();
                }
                $('#lessonGroupModal').modal('hide');
                $scope.$emit('endLoading');
            }, function (err) {
                $('#lessonGroupModal').modal('hide');
                $scope.$emit('endLoading');
                console.log(err);
            });
        } else {
            $scope.$emit('endLoading');
        }
    };

    $scope.delete = function (lsgId) {
        noty({
            text: 'Delete this lesson group, Do you want to continue?',
            buttons: [
                { 
                    addClass: 'btn btn-success', 
                    text: 'Ok', 
                    onClick: function($noty) {
                        $scope.$emit('beginLoading', true);

                        LessonGroup.get({ lsg_id: lsgId}, function (lsGrpData) {
                            if (lsGrpData) {
                                lsGrpData.$delete().then(function (rs) {
                                    if (rs.result === true) {
                                        noty({ theme: 'relax', type: 'success', text: 'This lesson group was deleted.', timeout: 3000 });
                                        _getLessonGroup();
                                        $scope.$emit('endLoading');
                                    }
                                });
                            } else {
                                 _getLessonGroup();
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
    };

    $scope.searches = function (searches) {
        _getLessonGroup(searches);
    };

    var _getLessonGroup = function (searches) {
        for (var prop in searches) {
            if (searches.hasOwnProperty(prop)) {
                if (searches[prop] === null) {
                    delete searches[prop];
                }
            }
        }

        LessonGroup.search(searches, function (result) {
            $scope.listing.tBody = result.data;
            $scope.$emit('endLoading');
        });
    };

    $('#lessonGroupModal').on('hide.bs.modal', function (e) {
        $scope.lessonGroupData = {};
    });

    LocalDB.getBearerToken(function (rs) {
        $scope.$emit('beginLoading', true);
        if (rs.result === true) {
            RoleRouteMap.getAccessRoute({ route_path: $location.path() }, function (acr) {
                if (acr.data.length > 0) {
                    _getLessonGroup();
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