"use strict";

controllers.controller('AudioApiController', ['$rootScope', '$scope', '$timeout', function ($rootScope, $scope, $timeout) {
    $scope.title = 'Example';

    $rootScope.requireUI = true;

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

    $scope.playing = false;
    $scope.pausing = false;

    $scope.currentTime = '00:00';
    $scope.durationTime = '00:00';
    $scope.startTime = 0;
    $scope.endTime = 0;

    var audio, sourceData;

    function initAudioPlayer() {
        audio = new Audio();
        audio.src = "data:audio/mpeg;base64," + sourceData;
        // audio.loop = false;
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('playing', onPlay);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('loadedmetadata', onLoadMedia);
    }

    function onLoadMedia(event) {
        var durmins = Math.floor(audio.duration / 60),
            dursecs = Math.floor(audio.duration - durmins * 60);

        $timeout(function () {
            $scope.durationTime = sprintf('%02d', durmins) + ':' + sprintf('%02d', dursecs);
            $scope.endTime = audio.duration;
        });
    }

    function onPlay(event) {}

    function onEnded(event) {
        $timeout(function () {
            if ($scope.tgLoop === true) {
                $scope.playing = true;
                $scope.pausing = false;
                audio.currentTime = $scope.startTime;
                this.play();
                // audio.loop = true;
            } else {
                $scope.playing = false;
                $scope.pausing = false;
                $scope.currentTime = '00:00';
            }
        });
    }

    function onTimeUpdate(event) {
        console.log('onTimeUpdate.event.currentTime: ', audio.currentTime);
        var curmins = Math.floor(audio.currentTime / 60),
            cursecs = Math.floor(audio.currentTime - curmins * 60),
            durmins = Math.floor(audio.duration / 60),
            dursecs = Math.floor(audio.duration - durmins * 60);

        $timeout(function () {
            if (audio.currentTime >= $scope.endTime) {
                if ($scope.tgLoop === true) {
                    audio.currentTime = $scope.startTime;
                } else {
                    $scope.stop();
                }
            } else {
                $scope.currentTime = sprintf('%02d', curmins) + ':' + sprintf('%02d', cursecs);
                $scope.durationTime = sprintf('%02d', durmins) + ':' + sprintf('%02d', dursecs);
            }
        });
    }

    $scope.play = function () {
        audio.currentTime = $scope.startTime;

        if (audio.paused) {
            audio.play();
            $scope.playing = true;
            $scope.pausing = false;
        }
    };

    $scope.pause = function () {
        if (!audio.paused) {
            audio.pause();
            $scope.playing = false;
            $scope.pausing = true;
        }
    }

    $scope.stop = function () {
        audio.load();
        $scope.playing = false;
        $scope.pausing = false;
        $scope.currentTime = '00:00';
    };

    // audio.addEventListener('timeupdate', onPlayEvent);
    // console.log(audio);



    initAudioPlayer();
}]);