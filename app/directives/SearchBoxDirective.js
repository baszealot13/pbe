"use strict";
/**
 * @public
 * @static
 * @function dtSearchBox
 * @description
 * SearchBox
 * @example
 * <dt-search-box></dt-search-box>
 * @see
 * partials/directives/SearchBox.html
 * @memberof app.directives
 */
directives.directive('dtSearchBox', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            searchColumns: '=?',
            searches: '=?'
        },
        controller: ['$scope', function ($scope) {
            $scope.params = {};
        }],
        templateUrl: 'partials/directives/SearchBox.html'
    };
}]);