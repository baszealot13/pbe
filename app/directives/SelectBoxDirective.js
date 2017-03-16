"use strict";
/**
 * @public
 * @static
 * @function dtSelectBox
 * @description
 * SelectBox
 * @example
 * <dt-select-box></dt-select-box>
 * @see
 * partials/directives/SelectBox.html
 * @memberof app.directives
 */
directives.directive('dtSelectBox', ['$timeout', '$filter', function ($timeout, $filter) {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            label: '@',
            placeholder: '@',
            ngModel: '=?',
            readOnly: '=?',
            options: '=?'
        },
        controller: (['$scope', '$injector', 'LocalDBService', function($scope, $injector, LocalDB) {
            var Model, modelMethod, params = {}, lists = {};
            
            if (typeof $scope.options !== 'undefined') {
                if (typeof $scope.options.model !== 'undefined') {
                    Model = $injector.get($scope.options.model.name);
                    
                    if (typeof $scope.options.model.method !== 'undefined') {
                        modelMethod = $scope.options.model.method;
                    }

                    if (typeof $scope.options.model.params !== 'undefined') {
                        params = $scope.options.model.params;
                    }

                    if (typeof $scope.options.model.lists !== 'undefined' && typeof $scope.options.model.lists.id !== 'undefined') {
                        lists.id = $scope.options.model.lists.id;
                    }

                    if (typeof $scope.options.model.lists !== 'undefined' && typeof $scope.options.model.lists.text !== 'undefined') {
                        lists.text = $scope.options.model.lists.text;
                    }

                    LocalDB.getBearerToken(function (rs) { 
                        if (rs.result === true) {
                            Model[modelMethod](params, function(results) {
                                $scope.options.data = [];
                                for (var i in results.data) {
                                    $scope.options.data.push({
                                        id: results.data[i][lists.id],
                                        text: results.data[i][lists.text]
                                    });
                                }
                            });
                        }
                    });
                } 
            }
        }]),
        link: function($scope, element, attrs) {
            var select = element.find('select');
            /*console.log($scope.ngModel);
            $timeout(function () {
                if ($scope.ngModel) {
                    
                    for (var i = 0; i < select[0].options.length; i++) {
                        if (typeof select[0].options[i] === 'object') {
                            if (select[0].options[i].value == $scope.ngModel) {
                                $(select[0].options[i]).attr('selected', 'selected');
                            } 
                        }
                    }
                }
            }); */
            
        },
        templateUrl: 'partials/directives/SelectBox.html'
    };
}]);