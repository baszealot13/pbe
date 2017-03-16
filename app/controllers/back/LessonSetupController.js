"use strict";

controllers.controller('LessonSetupController', 
    ['$rootScope', '$routeParams', '$location', '$scope', '$q', '$timeout', 'RoleRouteMap', 'Lesson', 'LocalDBService', 'ValidateService', 
    function ($rootScope, $routeParams, $location, $scope, $q, $timeout, RoleRouteMap, Lesson, LocalDB, Validate) {

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

    $scope.lessons = [];
    $scope.lessonData = {};

    $scope.lessonGroupOptions = {
        model: {
            name: 'LessonGroup',
            method: 'get',
            lists: {
                id: 'lsg_id',
                text: 'lsg_title'
            }
        }
    };

    $scope.modalTitle = '';
    $scope.isNew = false;

    $scope.rules = {
        requires: [{ id: 'ls_title', text: 'Title' },
            { id: 'ls_lsg_id', text: 'Group' },
            { id: 'ls_midi_path', text: 'Midi File' },
            { id: 'ls_mpeg_path', text: 'Mpeg File' }]
    };

    $scope.searchColumns = [{ id: 'ls_title', type: 'text', name: 'ls_title', title: 'Title' }];

    $scope.listing = {
        tHeader: [
            { id: 'ls_title', name: 'Title', action: {
                    type: 'function', name: 'openForm', param: 'ls_id'
                }},
            { id: 'ls_description', name: 'Description' },
            { id: 'lsg_title', name: 'Group' },
            { id: 'ls_active', name: 'Active', component: {
                    type: 'checkbox'
                }}
        ],
        tBody: [],
        options: {
            tools: [
                { type: 'delete', icon: 'delete', action: {
                    name: 'delete', param: 'ls_id'
                }},
                { type: 'edit', icon: 'create', action: {
                    name: 'openForm', param: 'ls_id'
                }}
            ]
        }
    };

    $scope.openForm = function (lsId) {
        if (typeof lsId !== 'undefined' && lsId !== null) {
            Lesson.get({ ls_id: lsId}, function (lsData) {
                $scope.lessonData = lsData;
                $scope.modalTitle = '#' + lsData.ls_title;
                $scope.isNew = false;
                $('#lessonModal').modal('show');
            });
        } else {
            $scope.lessonData = new Lesson();
            $scope.modalTitle = 'NEW LESSON';
            $scope.isNew = true;
            $('#lessonModal').modal('show');
        }
    };

    $scope.create = function (lessonData) {
        $scope.$emit('beginLoading', true);

        if (Validate.check(lessonData, $scope.rules) === true) {
            var fileFormat = new FormData();

            angular.forEach(lessonData, function(value, key) {
                fileFormat.append(key, value);
            });

            Lesson.create(fileFormat, function (rs) {
                if (typeof rs.result !== 'undefined' && rs.result === false) {
                    noty({ theme: 'relax', type: 'warning', text: rs.msg, timeout: 3000 });
                } else {
                    noty({ theme: 'relax', type: 'success', text: 'Save successed.', timeout: 3000 });
                    _getLessons();
                }
                $('#lessonModal').modal('hide');
                $scope.$emit('endLoading');
            });
        } else {
            $scope.$emit('endLoading');
        }
    };

    $scope.update = function (lessonData) {
        $scope.$emit('beginLoading', true);

        if (Validate.check(lessonData, $scope.rules) === true) {

            for(var ls in lessonData) {
                if (lessonData.hasOwnProperty(ls)) {
                    if (!lessonData[ls]) {
                        delete lessonData[ls];
                    }
                }
            }

            var fileFormat = new FormData();

            angular.forEach(lessonData, function(value, key) {
                fileFormat.append(key, value);
            });

            Lesson.update(fileFormat, function (rs) {
                if (typeof rs.result !== 'undefined' && rs.result === false) {
                    noty({ theme: 'relax', type: 'warning', text: rs.msg, timeout: 3000 });
                } else {
                    noty({ theme: 'relax', type: 'success', text: 'Save successed.', timeout: 3000 });
                    _getLessons();
                }
                $('#lessonModal').modal('hide');
                $scope.$emit('endLoading');
            });
        } else {
            $scope.$emit('endLoading');
        }
    };

    $scope.delete = function (lsId) {

        noty({
            text: 'Delete this lesson, Do you want to continue?',
            buttons: [
                { 
                    addClass: 'btn btn-success', 
                    text: 'Ok', 
                    onClick: function($noty) {
                        $scope.$emit('beginLoading', true);

                        Lesson.get({ ls_id: lsId}, function (lsData) {
                            console.log('lsData: ', lsData);
                            if (lsData) {
                                lsData.$delete().then(function (rs) {
                                    if (rs.result === true) {
                                        noty({ theme: 'relax', type: 'success', text: 'This lesson was deleted.', timeout: 3000 });
                                        _getLessons();
                                        $scope.$emit('endLoading');
                                    }
                                });
                            } else {
                                 _getLessons();
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
        _getLessons(searches);
    };

    var _getLessons = function (searches) {
        for (var prop in searches) {
            if (searches.hasOwnProperty(prop)) {
                if (searches[prop] === null) {
                    delete searches[prop];
                }
            }
        }

        Lesson.search(function (result) {
            $scope.listing.tBody = result.data;
            $scope.$emit('endLoading');
        });
    };

    $('#lessonModal').on('hide.bs.modal', function (e) {
        $scope.lessonData = {};
    });

    LocalDB.getBearerToken(function (rs) {
        $scope.$emit('beginLoading', true);
        if (rs.result === true) {
            RoleRouteMap.getAccessRoute({ route_path: $location.path() }, function (acr) {
                if (acr.data.length > 0) {
                    _getLessons();
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