"use strict";
/**
 * @public
 * @static
 * @function dtPassword
 * @description
 * TextBox
 * @example
 * <dt-password></dt-password>
 * @see
 * partials/directives/Password.html
 * @memberof app.directives
 */
directives.directive('dtPassword', ['$timeout', function ($timeout) {
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
        controller: ['$scope', function ($scope) {
            $scope.visibility = false;
        }],
        link: function($scope, element, attrs) {
            var input = element.find('input');

            if (typeof $scope.options !== 'undefined' && typeof $scope.options.placeHolder !== 'undefined') {
                input.attr('placeHolder', $scope.options.placeHolder)
            }

            if ($scope.ngModel) {
                input.val($scope.ngModel);
            }

            $scope.swVisibility = function () {
                $timeout(function () {
                    $scope.visibility = !$scope.visibility;

                    if ($scope.visibility === true) {
                        input.attr('type', 'text');
                    } else {
                        input.attr('type', 'password');
                    }
                    
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
        templateUrl: 'partials/directives/Password.html'
    };
}]);