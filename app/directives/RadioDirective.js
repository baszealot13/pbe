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
directives.directive('dtRadioGroup', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            ngModel: '=?',
            disabled: '=?',
            options: '=?'
        },
        controller: ['$scope', function ($scope) {
            
        }],
        link: function($scope, element, attrs) {
            $scope.chooseOption = function (value) {
                $timeout(function () {
                    $scope.ngModel = value;
                });
            };
        },
        templateUrl: 'partials/directives/RadioGroup.html'
    };
}]);