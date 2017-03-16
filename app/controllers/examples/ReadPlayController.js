"use strict";

controllers.controller('ReadPlayController', ['$rootScope', '$scope', '$timeout', 'Lesson', 'MidiService', 'LocalDBService', function ($rootScope, $scope, $timeout, Lesson, Mid, LocalDB) {
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

    $scope.playDisabled = false;
    $scope.pauseDisabled = false;
    $scope.stopDisabled = false;

    $scope.lesson = {};

    JZZ.synth.MIDIjs.register(0, { soundfontUrl: "soundfont/", instrument: ["acoustic_grand_piano"] });

    var play, msg;
    var port = JZZ().openMidiOut(0).or(function(){
        alert('Cannot open MIDI port!');
    });

    $scope.play = function (n) {
        port.send([0x90,n,100]);
    };

    $scope.stop = function () {
        port.send([0x80,60,0]);
    };


    var _loadFile = function(path) {
        $scope.$emit('beginLoading', true);
        var b64 = Mid.convertMid(path.data);
        _readMidiFile(JZZ_.MidiFile.fromBase64(b64));
    };

    var _readMidiFile = function (s){
        try{
            var mf = new JZZ_.MidiFile(s);
            _displayMidiFile(mf);
            // if (btn) {
                play = mf.player();
                play.onEvent = _onPlayer;
                $timeout(function () {
                    $scope.$emit('endLoading');
                }, 3000);
            // }
        } catch (e){ 
            console.log('_readMidiFile.catch: ', e);
        }
    };

    var _displayMidiFile = function (mf){
        document.getElementById('midi').innerHTML = '';
        var chunk;
        var div;
        var notes = ['C','C#','D','Eb','E','F','F#','G','G#','A','Bb','B'];


        chunk = document.createElement('div');
        chunk.innerHTML = '<div class=hdr>MThd</div>';
        div = document.createElement('div');
        div.innerHTML = 'type: ' + mf.type + (mf.ppqn? (', ppqn: ' + mf.ppqn): (' smpte: ' + mf.fps + 'x' + mf.ppf));
        chunk.appendChild(div);
        document.getElementById('midi').appendChild(chunk);

        

        for (var i=0; i < mf.length; i++) {
            chunk = document.createElement('div');
            chunk.innerHTML = '<div class=hdr>' + mf[i].type + '</div>';

            if (mf[i].data) {
                div=document.createElement('div');
                arr = []; s = mf[i].data;

                for (var j = 0; j < s.length; j++){
                    var c = s.charCodeAt(j) < 32? '-': s.charAt(j);

                    if (c == '&') c='&amp;'; if(c == '<') c = '&lt;'; if (c == '>') c = '&gt;';

                    var n = (s.charCodeAt(j) < 16? '0': '') + s.charCodeAt(j).toString(16);

                    if (j && !(j%32)) arr.push('<br>'); else if (j && !(j%8)) arr.push('&nbsp;');

                    arr.push('<span title="'+c+'">'+n+'</span>');
                }
                div.innerHTML = arr.join(' ');
                chunk.appendChild(div);
            }
            if (mf[i] instanceof JZZ_.MidiFile.MTrk) {
                var ticks = 60000 / (60 * mf.ppqn),
                    t = 0;

                // var curmins = Math.floor(audio.currentTime / 60),
                //     cursecs = Math.floor(audio.currentTime - curmins * 60),
                var minutes, seconds;
                for (var j = 0; j < mf[i].length; j++) {
                    var evt = mf[i][j];
                    var s = evt.toString().replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;');
                    /*var midiNote = [];
                    midiNote = prepareNote(s);
                    if (typeof midiNote !== 'undefined') {
                        $scope.orgNote.push({ note: midiNote[1] });
                    }*/
                    div = document.createElement('div');
                    if (evt.time !== 0) {
                        
                        t += t + (60000 / (60 * evt.time));
                        seconds = Math.floor((t/1000)%60);
                        minutes = Math.floor(((t - seconds)/1000)/60);

                        // console.log('timing : ' + sprintf('%02d', minutes) + ':' + sprintf('%02d', seconds));
                    }
                    // (60000 / (120 * 192))
                    // div.innerHTML = "<span class='clk'>" + t + " </span> <span>" + s + "</span>";
                    div.innerHTML = "<span class='clk'>" + evt.time + " </span> <span>" + s + "</span>";

                    // div.innerHTML = "<span class='clk'>" + evt.time + " : " + t.toFixed(4) + " </span> <span>" + s + "</span>";
                    chunk.appendChild(div);
                }
            }

            document.getElementById('midi').appendChild(chunk);
        }
    };

    var _onPlayer = function (e){
        // console.log(e);
        if (e.midi instanceof JZZ_.Midi) {
            var midi = e.midi.array();

            port.send(midi);
            
        }

        if (e.control =='play') {
            $timeout(function () {
                $scope.playDisabled = true;
                $scope.pauseDisabled = false;
                $scope.stopDisabled = false;
            });
        } else if (e.control == 'stop') {
            for(var i = 0; i < 16; i++) JZZ.MIDI(0xb0 + i, 123, 0); // port.send(0xb0 + i, 123, 0);
                $timeout(function () {
                    $scope.playDisabled = false;
                    $scope.pauseDisabled = false;
                    $scope.stopDisabled = false;
                });
        } else if (e.control == 'pause') {
            for(var i = 0; i < 16; i++) JZZ.MIDI(0xb0 + i, 123, 0);
                $timeout(function () {
                    $scope.pauseDisabled = true;
                });
        } else if (e.control == 'resume') {
            $timeout(function () {
                $scope.pauseDisabled = false;
            });
        }
    }

    $scope.playFile = function (){
        if ($scope.playDisabled !== true) {
            play.play();
        }
    };

    $scope.stopFile = function (){
        play.stop();
    };

    $scope.pauseFile = function () {
        if (play.playing) {
            play.pause();
        } else {
            play.resume();
        };
    };

    // $timeout(function () {
    //     _loadFile();
    // });
    LocalDB.getBearerToken(function (rs) {
        $scope.$emit('beginLoading', true);
        if (rs.result === true) {
            Lesson.getLesson({ ls_id: 1 }, function (lesson) {
                // console.log(lesson);
                $scope.lesson = lesson;
                _loadFile($scope.lesson.ls_midi_path);
                $scope.$emit('endLoading');
            });
        }
    });
    

}]);