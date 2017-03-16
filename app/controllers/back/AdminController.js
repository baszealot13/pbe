"use strict";

controllers.controller('AdminController', 
    ['$rootScope', '$routeParams', '$location', '$scope', '$q', '$filter', '$timeout', 'LocalDBService', 'RoleRouteMap',
    function ($rootScope, $routeParams, $location, $scope, $q, $filter, $timeout, LocalDB, RoleRouteMap) {

    $rootScope.requireUI = true;

    $scope.Breadcrumb = [];
    $scope.menuList = [];


    var currentPath = $location.path(),
        locationPath = '';
    
    for (var path in currentPath.split('/')) {
        var pathVal = currentPath.split('/')[path];
        locationPath += pathVal + '/';

        if (pathVal) {
            $scope.Breadcrumb.push({ title: pathVal, locationPath: locationPath.substr(0, locationPath.length-1) });
        }
    }


    LocalDB.getBearerToken(function (rs) {
        $scope.$emit('beginLoading', true);
        if (rs.result === true) {
            RoleRouteMap.getAccessRoute({ route_path: $location.path() }, function (acr) {
                if (acr.data.length > 0) {
                    RoleRouteMap.getMenu({
                        route_left: acr.data[0].Route.route_left,
                        route_right: acr.data[0].Route.route_right,
                        route_depth: acr.data[0].Route.route_depth
                    }, function (rrm) {
                        for (var i in rrm.data) {
                            var prop = rrm.data[i];

                            var objMenu = {
                                id: prop.route_id,
                                title: prop.Route.route_title,
                                parent: prop.route_parent,
                                subMenu: prop.subMenu,
                                locationPath: prop.Route.route_path,
                                kind: (prop.subMenu)? 'directory': 'document'
                            };

                            $scope.menuList.push(objMenu);
                        }

                        $scope.$emit('endLoading');
                    });
                } else {
                    $location.path('/');
                }
                
            });
        }
    });
    

}]);