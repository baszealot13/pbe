"use strict";

factories.factory('User', ['$resource',  function ($resource) {
    return $resource('/api/User', null, {
        getHomePage: {
            method: 'GET',
            url: '/api/User/HomePage'
        },
        get: {
            method: 'GET',
            url: '/api/User/:usr_id',
            params: {
                usr_id: '@usr_id'
            }
        },
        search: {
            method: 'POST',
            url: '/api/User'
        },
        create: {
            method: 'PUT',
            url: '/api/User/',
            transformRequest: angular.toJson
        },
        update: {
            method: 'PUT',
            url: '/api/User/:usr_id',
            params: {
                usr_id: '@usr_id'
            },
            transformRequest: angular.toJson
        },
        delete: {
            method: 'DELETE',
            url: '/api/User/:usr_id',
            params: {
                usr_id: '@usr_id'
            },
            transformRequest: angular.toJson
        },
        getMyProfile: {
            method: 'GET',
            url: '/api/MyProfile'
        },
        changePassword: {
            method: 'PUT',
            url: '/api/MyProfile/ChangePassword',
            transformRequest: angular.toJson
        }
    });
}]);