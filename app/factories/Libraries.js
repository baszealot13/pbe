"use strict";

factories.factory('Libraries', ['$resource',  function ($resource) {
    return $resource('/public/api/libraries/midi', null, {
        getMediaFIle: {
            method: 'GET'
        },
        addMidiFile: {
            method: 'PUT',
            url: '/public/api/libraries/addMidi',
            transformRequest: angular.identity,
            headers: { 
                'Content-Type': undefined 
            }
        }
    });
}]);