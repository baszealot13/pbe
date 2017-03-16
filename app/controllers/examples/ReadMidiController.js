"use strict";

controllers.controller('ReadMidiController', ['$rootScope', '$scope', '$timeout', 'Lesson', 'MidiService', 'LocalDBService', function ($rootScope, $scope, $timeout, Lesson, Mid, LocalDB) {
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
                { title: 'ReadMIDI', locationPath: 'Example/ReadMidi' },
                { title: 'Component', locationPath: 'Example/Component' },
                { title: 'Audio API', locationPath: 'Example/AudioApi' }
            ]
        }
    ];

    $scope.lesson = {};
    $scope.tables = [];

    


    LocalDB.getBearerToken(function (rs) {
        if (rs.result === true) {
            Lesson.getLesson({ ls_id: 3 }, function (lesson) {
                Mid.midLoad(Mid.convertMid(lesson.ls_midi_path.data)).then(function (midData) {
                    console.log(midData);
                    $timeout(function () {
                        $scope.mid = midData;
                    });
                });
            });
        }
    });

}]);