"use strict";
/**
 * @public
 * @static
 * @function dtTableListing
 * @description
 * TableListing
 * @example
 * <dt-table-listing></dt-table-listing>
 * @see
 * partials/directives/TableListing.html
 * @memberof app.directives
 */
directives.directive('dtTableListing', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            tHeader: '=?',
            tBody: '=?',
            tFooter: '=?',
            options: '=?',
            openForm: '=?',
            delete: '=?'
        },
        controller: ['$scope', function ($scope) {}],
        templateUrl: 'partials/directives/TableListing.html'
    };
}]);