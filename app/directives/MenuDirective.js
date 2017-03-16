"use strict";

/**
 * @public
 * @static
 * @function dtMenu
 * @description
 * Load MenuView file into menu (grid) html tag
 * @example
 * <dt-menu></dt-menu>
 * @see
 * partials/Menu.html
 * @memberof XeerSoft.app.directives
 */
directives.directive('dtMenu', [function () {
    return {
        restrict: 'E',
        scope: {
            menus: '=?',
            orderBy: '=?'
        },
        controller: ['$rootScope', '$location', '$scope', '$filter', '$timeout', 'LocalDBService', function ($rootScope, $location, $scope, $filter, $timeout, LocalDB) {
            if (!$scope.orderBy) {
                $scope.orderBy = 'title';
            }
            
            $scope.goTo = function (path, menu) {
                // if (menu.kind === 'document' && path !== '/') {
                //     LocalDB.addRouteCounter(menu);
                // }
                $timeout(function () {
                    $location.path(path);
                });
            };
        }],
        templateUrl: 'partials/directives/Menu.html'
    };
}]);