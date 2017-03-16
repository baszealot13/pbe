"use strict";

factories.factory('Lesson', ['$resource',  function ($resource) {
    return $resource('/api/Lesson', null, {
        get: {
            method: 'GET',
            url: '/api/Lesson/:ls_id',
            params: {
                ls_id: '@ls_id'
            }
        },
        getLesson: {
            method: 'GET',
            url: '/api/Lesson/Practice/:ls_id',
            params: {
                ls_id: '@ls_id'
            }
        },
        getByGroup: {
            method: 'GET',
            url: '/api/Lesson/ByGroup/:ls_lsg_id',
            params: {
                ls_lsg_id: '@ls_lsg_id'
            }
        },
        search: {
            method: 'POST',
            url: '/api/Lesson'
        },
        create: {
            method: 'PUT',
            url: '/api/Lesson/',
            transformRequest: angular.identity,
            headers: { 
                'Content-Type': undefined 
            }
        },
        update: {
            method: 'PUT',
            url: '/api/Lesson/Update',
            transformRequest: angular.identity,
            headers: { 
                'Content-Type': undefined 
            }
        },
        delete: {
            method: 'DELETE',
            url: '/api/Lesson/:ls_id',
            params: {
                ls_id: '@ls_id'
            },
            transformRequest: angular.toJson
        }
    });
}]);