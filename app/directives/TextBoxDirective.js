"use strict";
/**
 * @public
 * @static
 * @function dtTextBox
 * @description
 * TextBox
 * @example
 * <dt-text-box></dt-text-box>
 * @see
 * partials/directives/TextBox.html
 * @memberof app.directives
 */
directives.directive('dtTextBox', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            label: '@',
            name: '@',
            ngModel: '=?',
            require: '=?',
            readOnly: '=?',
            options: '=?'
        },
        controller: ['$scope', function ($scope) {}],
        link: function($scope, element, attrs) {
            var input = element.find('input');

            if (typeof $scope.options !== 'undefined' && typeof $scope.options.placeHolder !== 'undefined') {
                input.attr('placeHolder', $scope.options.placeHolder)
            }

            if ($scope.ngModel) {
                input.val($scope.ngModel);
            }

            $scope.clear = function () {
                $timeout(function () {
                    $scope.ngModel = null;
                    input.val(null);
                });
            };

            input.on('keypress', function (e) {
                $timeout(function () {
                    // $scope.ngModel = e.target.value;
                    if (e.keyCode === 13 && 
                        typeof $scope.options !== 'undefined' && 
                        typeof $scope.options.fn !== 'undefined') {
                        $scope.$emit($scope.options.fn, $scope.ngModel);
                    }
                });
            });

            input.on('blur', function (e) {
                $timeout(function () {
                    // $scope.ngModel = e.target.value;
                    if (typeof $scope.options !== 'undefined' && 
                        typeof $scope.options.fn !== 'undefined') {
                        $scope.$emit($scope.options.fn, $scope.ngModel);
                    }
                });
            });
        },
        templateUrl: 'partials/directives/TextBox.html'
    };
}]);