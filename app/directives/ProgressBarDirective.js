"use strict";
/**
 * @public
 * @static
 * @function dtProgressBar
 * @description
 * TextBox
 * @example
 * <dt-progress-bar></dt-progress-bar>
 * @see
 * partials/directives/ProgressBar.html
 * @memberof app.directives
 */
directives.directive('dtProgressBar', [function () {
    return {
        restrict: 'E',
        scope: {
            loadedPercentage: '=?',
            requireModal: '=?',
            loading: '=?'
        },
        controller: ['$scope', '$timeout', function ($scope, $timeout) {
            if (!$scope.loadedPercentage) { $scope.loadedPercentage = 100; }
            if (!$scope.requireModal) { $scope.requireModal = false; }
            if (!$scope.loading) { $scope.loading = false; }

            /**
             * Show progress bar
             * @param modal If true, it will mask its parent component
             */
            $scope.$parent.beginLoading = function (e, modal) {
                e.stopPropagation();
                $timeout(function () {
                    if (modal) {
                        $scope.requireModal = modal;
                    } else {
                        $scope.requireModal = false;
                    }
                    $scope.loadedPercentage = 100;
                    $scope.loading = true;
                });
            };
            $scope.$parent.$on('beginLoading', $scope.$parent.beginLoading);

            /**
             * Hide progress bar
             */
            $scope.$parent.endLoading = function (e) {
                e.stopPropagation();
                $timeout(function () {
                    $scope.requireModal = false;
                    $scope.loading = false;
                });
            };
            $scope.$parent.$on('endLoading', $scope.$parent.endLoading);

            /**
             * Set progress by percentage
             * @param percentage
             */
            $scope.$parent.setLoadingProgress = function (e, percentage) {
                e.stopPropagation();
                $timeout(function () {
                    if (percentage) {
                        $scope.loadedPercentage = percentage;
                    } else {
                        $scope.loadedPercentage = 100;
                    }
                });
            };
            $scope.$parent.$on('setLoadingProgress', $scope.$parent.setLoadingProgress);
        }],
        templateUrl: 'partials/directives/ProgressBar.html'
    };
}]);