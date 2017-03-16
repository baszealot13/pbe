"use strict";

controllers.controller('LessonGroupController', 
    ['$rootScope', '$routeParams', '$scope', '$q', '$timeout', 'LessonGroup', 'LocalDBService', 
    function ($rootScope, $routeParams, $scope, $q, $timeout, LessonGroup, LocalDB) {

    $rootScope.requireUI = true;

    $scope.lessonGroup = [];

    LocalDB.getBearerToken(function (rs) {
        $scope.$emit('beginLoading', true);
        if (rs.result === true) {
            LessonGroup.get(function (result) {
                $scope.lessonGroup = result.data;

                $scope.$emit('endLoading');
            });
        }

    });

}]);