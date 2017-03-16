"use strict";

controllers.controller('LessonListController', 
    ['$rootScope', '$routeParams', '$scope', '$q', '$timeout', 'Lesson', 'LessonGroup', 'LocalDBService',  
    function ($rootScope, $routeParams, $scope, $q, $timeout, Lesson, LessonGroup, LocalDB) {

    $rootScope.requireUI = true;

    $scope.lsgName = null;
    $scope.lessonList = [];

    var _getLessonGroup = function (lsgId) {
        return $q(function (resolve, reject) {
            try {
                LessonGroup.get({ lsg_id: lsgId}, function (result) {
                    resolve(result);
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    var _getLessonsByGroup = function (lsgId) {
        return $q(function (resolve, reject) {
            try {
                Lesson.getByGroup({ ls_lsg_id: lsgId }, function (result) {
                    resolve(result.data);
                    return;
                });
            } catch (e) {
                reject(e);
                return;
            }
        });
    };

    if (typeof $routeParams !== 'undefined' && Object.keys($routeParams).length !== 0) {
        LocalDB.getBearerToken(function (rs) {
            if (rs.result === true) {
                _getLessonGroup($routeParams.ls_lsg_id).then(function (result) {
                    $scope.lsgName = result.lsg_title;
                    return $routeParams.ls_lsg_id;
                }).then(_getLessonsByGroup)
                    .then(function (result) {
                        $scope.lessonList = result;
                    });
            }
        });
        
    } else {
        console.log('this page don\' have lesson!');
    }

    

}]);