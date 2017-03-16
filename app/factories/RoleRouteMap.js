"use strict";

factories.factory('RoleRouteMap', ['$resource',  function ($resource) {
    return $resource('/api/RoleRouteMap', null, {
        getAccessRoute: {
            method: 'GET',
            url: '/api/Role/Access/Route/:route_path',
            params: {
                route_path: '@route_path'
            },
            cancellable: true
        },
        getMenu: {
            method: 'GET',
            url: '/api/RoleRouteMap/Admin/Menu/:route_left/:route_right/:route_depth',
            params: {
                route_left: '@route_left',
                route_right: '@route_right',
                route_depth: '@route_depth'
            }
        }
    });
}]);