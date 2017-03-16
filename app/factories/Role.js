"use strict";

factories.factory('Role', ['$resource',  function ($resource) {
    return $resource('/api/Role', null, {
        get: {
            method: 'GET',
            url: '/api/Role/:role_id',
            params: {
                role_id: '@role_id'
            }
        },
        create: {
            method: 'PUT',
            url: '/api/Role/',
            transformRequest: angular.toJson
        },
        update: {
            method: 'PUT',
            url: '/api/Role/:role_id',
            params: {
                role_id: '@role_id'
            },
            transformRequest: angular.toJson
        },
        delete: {
            method: 'DELETE',
            url: '/api/Role/:role_id',
            params: {
                role_id: '@role_id'
            },
            transformRequest: angular.toJson
        }
    });
}]);