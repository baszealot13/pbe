"use strict";
/**
 * @public
 * @static
 * @function dtCheckBox
 * @description
 * CheckBox
 * @example
 * <dt-check-box></dt-check-box>
 * @see
 * partials/directives/CheckBox.html
 * @memberof app.directives
 */
directives.directive('dtCheckBox', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            label: '@',
            name: '@',
            ngModel: '=?',
            disabled: '=?',
            isChecked: '=?',
            options: '=?'
        },
        controller: ['$scope', function ($scope) {
            // $scope.$watch('ngModel', function (newVal, oldVal) {
            //     if (newVal !== oldVal) 
            //         $scope.ngModel = ($scope.ngModel)? 1: 0;
            // });
        }],
        link: function($scope, element, attrs) {
            var checkBox = element.find('input');

            if (typeof $scope.disabled !== 'undefined' && $scope.disabled === true) {
                checkBox.attr('disabled','disabled');
            } else {
                checkBox.removeAttr('disabled');
            }

            $scope.$watch('disabled', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (typeof newVal !== 'undefined' && (newVal === true || $scope.ngModel === 1)) {
                        checkBox.attr('disabled','');
                    } else {
                        checkBox.removeAttr('disabled');
                    }
                }
            });

            $timeout(function () {
                if ($scope.ngModel) {
                    if (typeof $scope.ngModel === 'number') {
                        $scope.ngModel = true;
                    }
                    checkBox.attr('checked','checked');
                } else {
                    checkBox.removeAttr('checked');
                }
            });
        },
        templateUrl: 'partials/directives/CheckBox.html'
    };
}]);