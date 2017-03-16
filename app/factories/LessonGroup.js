"use strict";

factories.factory('LessonGroup', ['$resource',  function ($resource) {
    return $resource('/api/LessonGroup', null, {
        get: {
            method: 'GET',
            url: '/api/LessonGroup/:lsg_id',
            params: {
                lsg_id: '@lsg_id'
            }
        },
        search: {
            method: 'POST',
            url: '/api/LessonGroup'
        },
        create: {
            method: 'PUT',
            url: '/api/LessonGroup/',
            transformRequest: angular.toJson
        },
        update: {
            method: 'PUT',
            url: '/api/LessonGroup/:lsg_id',
            params: {
                lsg_id: '@lsg_id'
            },
            transformRequest: angular.toJson
        },
        delete: {
            method: 'DELETE',
            url: '/api/LessonGroup/:lsg_id',
            params: {
                lsg_id: '@lsg_id'
            },
            transformRequest: angular.toJson
        }
    });
}]);