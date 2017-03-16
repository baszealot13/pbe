"use strict";

/**
 * @public
 * @static
 * @function dtBreadcrum
 * @description
 * @example
 * <dt-breadcrum></dt-breadcrum>
 * @see
 * partials/Breadcrum.html
 * @memberof XeerSoft.app.directives
 */
directives.directive('dtBreadcrum', [function () {
    return {
        restrict: 'E',
        scope: {
            items: '=?'
        },
        controller: ['$rootScope', '$location', '$scope', function ($rootScope, $location, $scope) {
            
        }],
        templateUrl: 'partials/directives/Breadcrum.html'
    };
}]);