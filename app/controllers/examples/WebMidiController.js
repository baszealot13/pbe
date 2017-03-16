"use strict";

controllers.controller('WebMidiController', ['$rootScope', '$scope', '$timeout', 'MidiService', function ($rootScope, $scope, $timeout, WebMidi) {
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
                { title: 'Component', locationPath: 'Example/Component' }
            ]
        }
    ];

    JZZ.synth.MIDIjs.register(0, { soundfontUrl: "soundfont/", instrument: ["acoustic_grand_piano"] });
    var port = JZZ().openMidiOut(0).or(function(){
        alert('Cannot open MIDI port!');
    });

    $scope.note = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G','G#', 'A', 'A#', 'B'];
    $scope.displayNote = '';

    WebMidi.load();

    WebMidi.MIDIMessageEventHandler = function (event) {
        switch (event.data[0] & 0xf0) {
            case 0x90:
                if (event.data[2] !== 0) {  // if velocity != 0, self is a note-on message
                    $timeout(function () {
                        $scope.displayNote = _pitchToNote(event.data[1]) + ' noteOn';
                        port.send([0x90,event.data[1],100]);
                    });
                }
                break;
              // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
            case 0x80:
                $timeout(function () {
                    $scope.displayNote = _pitchToNote(event.data[1]) + ' noteOff';
                    port.send([0x80,event.data[1],100]);
                });
                break;
        }
    };

    var _pitchToNote = function (pitch) {
        return $scope.note[pitch % 12] + Math.floor(pitch / 12);
    };

    $scope.loadMidi = function () {
        WebMidi.load();
    };


    
    



}]);