"use strict";
/**
 * @public
 * @static
 * @function dtFileUpload
 * @description
 * FileUpload
 * @example
 * <dt-file-upload></dt-file-upload>
 * @see
 * partials/directives/FileUpload.html
 * @memberof app.directives
 */
directives.directive('dtFileUpload', ['$timeout', function ($timeout) {
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
        require: 'ngModel',
        controller: ['$scope', function ($scope) {
            $scope.progress = false;
            $scope.removeFile = false;

            var flagBinding = true;

            if (typeof $scope.ngModel !== 'undefined' && $scope.ngModel !== null) {
                $timeout(function () {
                    $scope.emptyFile = true;
                    $('input[name="' + $scope.name + '_display"]').val($scope.ngModel);
                });
            }

            $scope.getFileInfo = function (elm) {
                var files = elm.files[0];
                
                $scope.progress = true;

                if (typeof $scope.options !== 'undefined') {
                    if (typeof $scope.options.types !== 'undefined') {

                        for (var type in $scope.options.types) {
                            var fileType = files.name.split('.').pop();

                            if ($scope.options.types[type].toLowerCase() === fileType.toLowerCase()) {
                                console.log(fileType.toLowerCase());
                                flagBinding = true;
                                break;
                            } else {
                                console.log(fileType.toLowerCase());
                                flagBinding = false;
                            }
                        }
                    }
                }


                $timeout(function () {
                    if (flagBinding === true) {
                        $scope.ngModel = files;
                        $scope.removeFile = true;
                        $scope.progress = false;
                        $timeout(function () {
                            $('input[name="' + $scope.name + '_display"]').val(files.name);
                        });
                    } else {
                        noty({ theme: 'relax', type: 'warning', text: 'File type not correctly.', timeout: 3000 });
                        $scope.progress = false;
                    }
                });
                
            };

            $scope.clear = function () {
                $timeout(function () {
                    $('input[name="' + $scope.name + '_display"]').val(null);
                    $scope.ngModel = null;
                    $scope.removeFile = false;
                });
            };

        }],
        link: function($scope, element, attrs, ngModel) {
            ngModel.$render = function () {
                if (ngModel.$modelValue) {
                    $('input[name="' + $scope.name + '_display"]').val(ngModel.$modelValue);
                    $scope.removeFile = true;
                } else {
                    $('input[name="' + $scope.name + '_display"]').val(null);
                    $scope.ngModel = null;
                    $scope.removeFile = false;
                }
            };
        },
        templateUrl: 'partials/directives/FileUpload.html'
    };
}]);