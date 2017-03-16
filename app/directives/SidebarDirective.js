"use strict";
/**
 * @public
 * @static
 * @function dtRadioGroup
 * @description
 * RadioGroup
 * @example
 * <dt-radio-group></dt-radio-group>
 * @see
 * partials/directives/RadioGroup.html
 * @memberof app.directives
 */
directives.directive('dtSidebar', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            items: '=?'
        },
        controller: ['$scope', function ($scope) {
        }],
        templateUrl: 'partials/directives/Sidebar.html'
    };
}]);