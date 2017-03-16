"use strict";
/**
 * @public
 * @static
 * @function dtToggle
 * @description
 * Toggle
 * @example
 * <dt-toggle></dt-toggle>
 * @see
 * partials/directives/Toggle.html
 * @memberof app.directives
 */
directives.directive('dtToggle', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            label: '@',
            name: '@',
            ngModel: '=?',
            disabled: '=?',
            options: '=?'
        },
        controller: ['$scope', function ($scope) {}],
        link: function($scope, element, attrs) {
            var toggle = element.find('input');

            if ($scope.ngModel) {
                toggle.attr('checked','');
            } else {
                toggle.removeAttr('checked');
            }

            if (typeof $scope.disabled !== 'undefined' && $scope.disabled === true) {
                toggle.attr('disabled','');
            } else {
                toggle.removeAttr('disabled');
            }
        },
        templateUrl: 'partials/directives/Toggle.html'
    };
}]);