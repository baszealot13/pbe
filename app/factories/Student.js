"use strict";

factories.factory('Student', ['$resource',  function ($resource) {
    return $resource('/api/Student', null, {
        get: {
            method: 'GET',
            url: '/api/Student/:std_id',
            params: {
                std_id: '@std_id'
            }
        },
        create: {
            method: 'PUT',
            url: '/api/Student/',
            transformRequest: angular.toJson
        },
        update: {
            method: 'PUT',
            url: '/api/Student/:std_id',
            params: {
                std_id: '@std_id'
            },
            transformRequest: angular.toJson
        },
        delete: {
            method: 'DELETE',
            url: '/api/Student/:std_id',
            params: {
                std_id: '@std_id'
            },
            transformRequest: angular.toJson
        }
    });
}]);