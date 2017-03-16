"use strict";

controllers.controller('ComponentController', ['$rootScope', '$scope', '$timeout', function ($rootScope, $scope, $timeout) {
    $scope.title = 'Examples';

    $rootScope.requireUI = true;
    $rootScope.navBottom = true;

    $rootScope.navMenu = [
        {
            dropdown: true,
            title: 'Example',
            menus: [
                { title: 'Key On/Off', locationPath: 'Example/WebMidi' },
                { title: 'Read/Play MIDI', locationPath: 'Example/ReadPlay' },
                { title: 'Component', locationPath: 'Example/Component' },
                { title: 'Audio API', locationPath: 'Example/AudioApi' }
            ]
        }
    ];

    $scope.selectBox = 3;



}]);