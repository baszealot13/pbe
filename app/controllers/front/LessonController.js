"use strict";

controllers.controller('LessonController', 
    ['$rootScope', '$routeParams', '$scope', '$q', '$filter', '$timeout', 'Lesson', 'LessonGroup', 'MidiService', 'ScalesService', 'LocalDBService', 'SweetAlert', 
    function ($rootScope, $routeParams, $scope, $q, $filter, $timeout, Lesson, LessonGroup, Mid, Scales, LocalDB, SweetAlert) { 

    $rootScope.requireUI = true;
    $scope.setting = true;

    $scope.lesson = {};

    /* Tools bar */
    $scope.dischkPlayAll = false;
    $scope.disChkLoop = false;
    $scope.disChkTiming = false;

    $scope.playAll = true;
    $scope.checkTiming = false;
    $scope.loop = true;
    $scope.visibleBar =  false;

    $scope.curtime = '00:00';
    $scope.durtime = '00:00';


    $scope.hearing = true;
    $scope.pause = false;
    $scope.resume = false;

    /* Audio scope */
    $scope.startTime = 0;
    $scope.endTime = 0;

    
    /* Midi scope */
    $scope.bars = 0;
    $scope.barSelected = []; 

    $scope.orgNote = [];
    $scope.orgNoteNum = [];
    $scope.orgSort = [];

    // $scope.note = ['C','C#','D','Eb','E','F','F#','G','G#','A','Bb','B'];

    $scope.keyNote = [];
    $scope.prevNote = [];
    $scope.prepareLine = [];
    $scope.boardLine = [];
    $scope.playNoted = [];
    $scope.tickIntro = 0;
    $scope.befrPlayIntro = 0;
    $scope.befrPlay = 0;

    $scope.notePlaying = 0;
    $scope.tlWidth = 0;

    // 
    $scope.startCount = false;
    $scope.countNoteOn = 0;
    $scope.countLine = 0;
    $scope.Score = 0;

    $scope.btnPlay = false;
    $scope.btnPause = false;
    $scope.btnStop = false;
    $scope.btnPractice = false;
    $scope.btnBack = false;
    $scope.btnStopPractice = false;
    /**************************************/   

    $scope.curTrack = 0; 
    $scope.prevTrack = 0;
    $scope.nextTrack = 0;

    $scope.correctNote = 0;
    $scope.wrongNote = 0;
    $scope.notePerBar = 0;

    $scope.timeOutBar = 0;

    $scope.playPerBar = false;

    $scope.midLists = {};

    
    var audio, lastnote, seekslider, seeking, seekto, slider, timingBar, pausing = false, tbPlay, tbBoard, timelineBoard, soundFront, tickCount = 0, tickCountAll = 0, timeout,
        btnPlay, btnPause, btnStop, btnPractice, cutNoteEnd = 0.473436, promise, soundFront; // 0.473436

    $scope.slider = {
        value: '0;100',
        options: {
            from: 0,
            to: 100,
            threshold: 4,
            floor: true,
            step: 1,
            skin: 'plastic',
            dimension: '',
            vertical: false,
            css: {
                background: {"background-color": "#dddddd"},
                default: {"background-color": "#dddddd"}, // default value: 1px
                pointer: {"background-color": "#2195f3"},   // circle pointer
                range: {"background-color": "#2195f3"} // use it if double value
            },
            callback: function(value, elt) {
                var ranges = value.split(';');
                $scope.startTime = ranges[0];
                $scope.endTime = ranges[1];
                $scope.playAll = false;
                // console.log('$scope.slider.options.callback: ', value);
            }    
        }
    };

    if (typeof $routeParams !== 'undifined' && typeof $routeParams.ls_id !== 'undifined') {
        $scope.$emit('beginLoading', true);
        LocalDB.getBearerToken(function (rs) {
            if (rs.result === true) {
                Lesson.getLesson({ ls_id: $routeParams.ls_id }, function (lesson) {
                    audio = new Audio();
                    audio.src = "data:audio/mpeg;base64," + Mid.convertMid(lesson.ls_mpeg_path.data);

                    seekslider = document.getElementById('seekslider');
                    timingBar = document.getElementById('timingBar');

                    audio.addEventListener('timeupdate', _onTimeUpdate);
                    // audio.addEventListener('playing', function (evt) { console.log(evt);});
                    audio.addEventListener('ended', _onEnded);
                    audio.addEventListener('loadedmetadata', _onLoadMedia);

                    seekslider.addEventListener('mousedown', function (event) { seeking = true; _onSeek(event); });
                    seekslider.addEventListener('mousemove', function (event) { _onSeek(event); });
                    seekslider.addEventListener('mouseup', function () { seeking = false; });



                    Mid.midLoad(Mid.convertMid(lesson.ls_midi_path.data)).then(function (midData) {
                        $timeout(function () {
                            console.log('midData: ', midData);
                            $scope.lesson = lesson;
                            $scope.midLists = midData;

                            lastnote = $scope.midLists.lists.pop();
                            $scope.bars = Math.floor((lastnote.deltaTimePlus/$scope.midLists.ppqn)/$scope.midLists.numerator);
                            $scope.befrPlay = $scope.slider.options.threshold = $scope.midLists.numerator;
                            $scope.befrPlayIntro = $scope.tickIntro = ((($scope.midLists.numerator/2)%1) === 0)? $scope.midLists.numerator/2: $scope.midLists.numerator;
                            $scope.orgNoteNum = Scales.findDuplicateArray($scope.midLists.orgNoteNum);

                            tbPlay = document.getElementById('tbPlay');
                            tbBoard = document.getElementById('tbBoard');
                            timelineBoard = document.getElementById('timelineBoard');

                            tbPlay.onscroll = function (event) {
                                // console.log('scrollLeft: ', event.target.scrollLeft);
                                tbBoard.scrollLeft = event.target.scrollLeft;
                            };

                            tbBoard.onscroll = function (event) {
                                tbPlay.scrollLeft = event.target.scrollLeft;
                            };

                            Mid.load();
                            audio.load();

                            JZZ.synth.MIDIjs.register(0, { soundfontUrl: "soundfont/", instrument: ["acoustic_grand_piano"] });

                            soundFront = JZZ().openMidiOut(0).or(function(){
                                console.log('Cannot open MIDI port!');
                            });

                            $scope.$emit('endLoading');
                        });
                    });
                });
            }
        });
    }


    /***************** Audio event ***********************/
    var _onLoadMedia = function (event) {
        var durmins = Math.floor(audio.duration / 60),
            dursecs = Math.floor(audio.duration - durmins * 60);

        console.log('=======onLoadMedia============');


        $timeout(function () {
            if ($scope.playPerBar === false) {
                $scope.endTime = (!$scope.endTime)? audio.duration: $scope.endTime;

                $scope.slider.value = '0;' + audio.duration;
                $scope.slider.options.from = 0;
                $scope.slider.options.to = audio.duration.toFixed(0);

                seekslider.value = 0;
                $scope.curtime = '00:00';
                $scope.durtime = sprintf('%02d', durmins) + ':' + sprintf('%02d', dursecs);
            } else {
                $scope.startPracticeSplit();    
                seekslider.value = 0;
                $scope.curtime = '00:00';
                $scope.durtime = sprintf('%02d', durmins) + ':' + sprintf('%02d', dursecs);         
            } 
        });
    };

    var _onEnded = function (event) {
        $timeout(function () {
            // audio.currentTime = $scope.startTime;
            // audio.duration = $scope.endTime; 
            // seekslider.value = audio.currentTime * (100 / audio.duration);
            // 
            $scope.seekValue = 0;

            if ($scope.loop === true && $scope.startCount === false && $scope.playPerBar === false) {
                // audio.currentTime = $scope.startTime;
                // audio.duration = $scope.endTime; 
                audio.play();
            } else if ($scope.startCount === true && $scope.checkTiming === true) {
                timeout = $timeout(function () {
                    _calculateScore($scope.midLists.orgNote.length, $scope.countNoteOn, $scope.Score);
                }, 500*1);
            }

            if ($scope.startCount === true) {
                $scope.startCount = false;

                $scope.btnPractice = false;
                $scope.btnPlay = false;
                $scope.btnPause = false;
                $scope.btnStop = false;
                $scope.btnBack = false;

                $scope.dischkPlayAll = false;
                $scope.disChkLoop = false;
                $scope.disChkTiming = false;

                // $('#board').animate({
                //     scrollTop: $('#tbBoard').height()
                // }, 'fast');
            }
        });
    };

    var _onSeek = function (event) {
        if (seeking) {
            seekto = audio.duration * ((event.clientX - seekslider.offsetLeft) / 1000);
            audio.currentTime = seekto;
        }
    };

    var _onTimeUpdate = function (event) {
        var nt = audio.currentTime * (100 / audio.duration),
            curmins = Math.floor(audio.currentTime / 60),
            cursecs = Math.floor(audio.currentTime - curmins * 60),
            durmins = Math.floor(audio.duration / 60),
            dursecs = Math.floor(audio.duration - durmins * 60);

        // console.log('audio.currentTime: ', audio.currentTime );
        // console.log('$scope.endTime: ', $scope.endTime);
        // console.log('$scope.startCount: ', $scope.startCount);

        // console.log('currentTime: ', audio.currentTime);

        $timeout(function () {

            if (audio.currentTime >= $scope.endTime && $scope.startCount === false) {

                // console.log('===============ontimeupdate:stop==================');
                if ($scope.loop === true && $scope.startCount === false && $scope.playPerBar === false) {
                    // console.log('ontimeupdate:case:1');
                // if ($scope.loop === true && $scope.startCount === false) {
                    audio.currentTime = $scope.startTime;
                } else {
                    // console.log('ontimeupdate:case:2');
                    // if ($scope.playPerBar === false) {
                    $scope.stopAudio();
                    // }
                }
                pausing = false;
            } else {
                seekslider.value = nt;
                // timingBar.value = nt;

                $scope.curtime = sprintf('%02d', curmins) + ':' + sprintf('%02d', cursecs);
                $scope.durtime = sprintf('%02d', durmins) + ':' + sprintf('%02d', dursecs);
            }
        });
    };

    /*var _setBar = function (b) {
        var firstBar, lastBar;

        if ($scope.barSelected.length >= 2) {
            $scope.barSelected.pop();
        }

        $scope.barSelected.push(b);
        $scope.barSelected.sort(function(a, b){ return a - b });


        if ($scope.barSelected.length > 0) {
            firstBar = Mid.calculateNoteToTime($scope.barSelected[0] - $scope.midLists.ppqPerBars, $scope.midLists.ppqn, $scope.midLists.bps);
            lastBar = Mid.calculateNoteToTime($scope.barSelected[$scope.barSelected.length-1], $scope.midLists.ppqn, $scope.midLists.bps);
            

            $scope.startTime = firstBar;
            $scope.endTime = lastBar;
        } 
    };*/
    /***************** Audio event ***********************/

    /***************** set practice ************************/
    var _setKeyNote = function () {
        var btwNoteWigth = 30,
            note = Mid.notes;

        $scope.keyNote = [];
        var lastNote = _setLastNote($scope.orgNoteNum, note);

        var inScale = Scales.pattern($scope.orgNoteNum);
        var dfPosition = 0;
        
        for (var i = 2; i < 10; i++) {
            for (var n in note) {
                var scaleNote = 0;

                if (lastNote === note[n] + i) { 
                    dfPosition = btwNoteWigth;
                }

                if (inScale !== null) {

                    for (var nt in inScale.notes) {
                        if (inScale.notes[nt].key === note[n]) {
                            scaleNote = inScale.notes[nt].type;
                        }
                    }
                }


                $scope.keyNote.push({ note: note[n], oct: i, active: 0, scaleNote: scaleNote, position: btwNoteWigth });

                btwNoteWigth += 30
            }
        }

        // console.log($scope.keyNote);

        // for (var i = 0; i < 5; i++) {
        //     $scope.boardLine.push($scope.keyNote);
        // }

        $timeout(function () {
            _tableScrolling(dfPosition - 30);
        });
    };

    var _setLastNote = function (ln, arrNote) {
        var lastNote = ln;

        lastNote.sort(function (a, b) {
            return a - b;
        });
        lastNote = lastNote.pop();
        // console.log(lastNote);
        // console.log(arrNote[lastNote%12] + Math.floor(lastNote / 12));

        return arrNote[lastNote%12] + Math.floor(lastNote / 12);
    };

    var _tableScrolling = function (position) {
        document.getElementById('tbPlay').scrollLeft = position;
        document.getElementById('tbBoard').scrollLeft = position;
    };

    // get midi event
    Mid.MIDIMessageEventHandler = function (event) {
        switch (event.data[0] & 0xf0) {
            case 0x90:
                if (event.data[2] !== 0) {  // if velocity != 0, self is a note-on message
                    // soundFront.send([0x90, event.data[1], 100]);
                    // console.log('time.note-on: ', audio.currentTime);
                    _playNote(1, event.data[1], audio.currentTime);
                }
                break;
              // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
            case 0x80:
                // soundFront.send([0x80, event.data[1], 0]);
                // console.log('time.note-off: ', audio.currentTime);
                _playNote(0, event.data[1]);
                break;
        }
    };

    var _playNote = function (noteStatus, noteNumber, time) {
        var noteText = Mid.notes[noteNumber % 12] + Math.floor(noteNumber / 12),
            elm = document.getElementById(noteText),
            notePosit = elm.getAttribute('notePosit');  // for scroll


        // if (parseInt(notePosit) > parseInt(screen.width) || parseInt(notePosit) < parseInt(screen.width)) {
        //     _tableScrolling(notePosit);
        // }
            
        // NOTE:OFF
        if(noteStatus == 0) {
            elm.innerHTML = '';

            

            if ($scope.midLists.orgNote.length === $scope.Score && $scope.checkTiming === false && $scope.playPerBar === false) {
                _calculateScore($scope.midLists.orgNote.length, $scope.countNoteOn, $scope.Score);
            } else if ($scope.midLists.tracks[$scope.curTrack].notes.length === $scope.Score && $scope.checkTiming === false && $scope.playPerBar === true) {
                _calculateScore($scope.midLists.tracks[$scope.curTrack].notes.length, $scope.countNoteOn, $scope.Score);
            } 
            // else {
            //     countNoteOnFreeze = $scope.countNoteOn;

            //     timeout = $timeout(function() {
            //         if (countNoteOnFreeze === $scope.countNoteOn) {
            //             alert('******timeout*******');
            //             $timeout.cancel(timeout);
            //         }
            //     }, 4*1000);

            // }
        } 
        // NOTE:ON
        else if(noteStatus == 1) {
            // elm.innerHTML = '<a href="" class="btn btn-info btn-fab-super-mini"><i class="material-icons">music_note</i></a>';
            // elm.innerHTML = '<span class="pbe-note pbe-note-tab"><strong>' + noteText + '</strong></span>';

            // if ($scope.midLists.orgNote.length - 1 === $scope.Score && $scope.checkTiming === false && $scope.playPerBar === false) {
            //     _calculateScore($scope.midLists.orgNote.length - 1, $scope.countNoteOn, $scope.Score);
            // } else if ($scope.midLists.tracks[$scope.curTrack].notes.length - 1 === $scope.Score && $scope.checkTiming === false && $scope.playPerBar === true) {
            //     _calculateScore($scope.midLists.tracks[$scope.curTrack].notes.length - 1, $scope.countNoteOn, $scope.Score);
            // }

            if ($scope.startCount === true) {
                $scope.countNoteOn++;
                // countNoteOnFreeze = $scope.countNoteOn;
                _addToBoard(noteNumber, time);
            }
            
        }
    };

    var _addToBoard = function (noteNumber, time) {
        var brdNote = [],
            stNote = 24,
            note = Mid.notes[noteNumber % 12] + Math.floor(noteNumber / 12),
            notes = Mid.notes,
            ptTimed = 0,
            noteIndex = $scope.Score,
            prop, calTime, 
            elm = document.getElementById(note),
            marginLeft = Math.floor(time*60),
            noteChecking;
        
        if ($scope.checkTiming === true) {
            noteIndex = $scope.notePlaying;
        }

        if ($scope.playPerBar === false) {
            noteChecking = $scope.midLists.orgNote[noteIndex];
        } else {
            noteChecking = $scope.midLists.tracks[$scope.curTrack].notes[noteIndex];
        }

        // console.log('noteIndex: ', noteIndex);
        // console.log('noteChecking: ', noteChecking.noteNum);
        // console.log('noteNumber: ', noteNumber);

        for (var i = 2; i < 10; i++) {
            for (var j in notes) {

                brdNote.push({
                    note: notes[j],
                    nnum: stNote,
                    oct: i,
                    active: 0,
                    noteFrom: 0,
                    time: time.toFixed(2)
                });

                stNote++;
            }
        }

        $scope.prevNote.push({ note: note, nnum: noteNumber });

        for (var i in brdNote) {
            var prop = brdNote[i];
                
            if (prop.nnum === noteNumber) {

                if (noteChecking.noteNum === noteNumber) {                    
                    // $scope.countCorrectNote++;
                    prop.active = 1;
                    ptTimed = noteChecking.time;
                    elm.innerHTML = '<span class="pbe-note pbe-note-tab success"><strong><i class="material-icons" style="font-size: 12px;">done</i></strong></span>';
                    // elm.innerHTML = '<span class="pbe-note pbe-note-tab success"><i class="material-icons" style="font-size: 12px;">mood</i></span>';
                    $scope.Score++;
                    $scope.correctNote++;
                } else {
                    prop.active = 2;
                    elm.innerHTML = '<span class="pbe-note pbe-note-tab wrong"><strong><i class="material-icons" style="font-size: 12px;">clear</i></strong></span>';
                    $scope.wrongNote++;
                    // soundFront.send([0x99, 40, 127]);
                    // elm.innerHTML = '<span class="pbe-note pbe-note-tab wrong"><i class="material-icons" style="font-size: 12px;">mood</i></span>';
                }

                $scope.notePlaying++;
            } else {
                if (typeof $scope.prevNote[$scope.prevNote.length - 2] !== 'undefined') {
                  
                    if ((prop.nnum >= $scope.prevNote[$scope.prevNote.length - 2].nnum && prop.nnum < (parseInt(noteNumber)-1)) 
                        || (prop.nnum <= $scope.prevNote[$scope.prevNote.length - 2].nnum && prop.nnum > (parseInt(noteNumber)+1))) { 
                        prop.noteFrom = 1;
                    } else if (prop.nnum >= $scope.prevNote[$scope.prevNote.length - 2].nnum && parseInt(prop.nnum) < parseInt(noteNumber)) { 
                        prop.noteFrom = 2;
                    } else if (prop.nnum <= $scope.prevNote[$scope.prevNote.length - 2].nnum && parseInt(prop.nnum) > parseInt(noteNumber)) {
                        prop.noteFrom = 3;
                    }
                }
            }
        }

        calTime = _calculateTime(ptTimed, time);

        if ($scope.checkTiming === true) {
            var divNote = document.createElement('div'), divStatus;
            divNote.setAttribute('id', 't' + $scope.notePlaying);
            if (calTime.perDif <= 10 && calTime.perDif >= 0) {
                divStatus = 'success';
            } else if (calTime.perDif <= 30 && calTime.perDif > 10) {
                divStatus = 'warning';
            } else if (calTime.perDif > 30) {
                divStatus = 'error';
            }

            if (calTime.perDif > 0 && Math.floor(time) > ptTimed) {
                divNote.setAttribute('class', 'tl-active ' + divStatus);
                divNote.setAttribute('style', 'position: absolute; left: ' + marginLeft + 'px; top: 60px');
            } else if (calTime.perDif > 0 && Math.floor(time) < ptTimed) {
                divNote.setAttribute('class', 'tl-active ' + divStatus);
                divNote.setAttribute('style', 'position: absolute; left: ' + marginLeft + 'px; top: 140px');
            } else {
                divNote.setAttribute('class', 'tl-active ' + divStatus);
                divNote.setAttribute('style', 'position: absolute; left: ' + marginLeft + 'px; top: 100px');
            }
            timelineBoard.appendChild(divNote);

        }

        $scope.playNoted.push({
            note: noteNumber,
            time: time,
            ptTimed: ptTimed,
            timeDif: calTime.perDif,
            timeScore: calTime.scoreTime
        });


        $timeout(function () { 
            // $scope.prepareLine.push(brdNote); 

            $scope.boardLine.push(brdNote); 
        
            $('#board').animate({
                scrollTop: $('#tbBoard').height()
            }, 'fast');  

            if ($scope.checkTiming === true) {
                $('#t' + Math.floor($scope.notePlaying - 1)).connections({ to: '#t' + $scope.notePlaying, class: 'tl-active-line', within: '#timelineBoard', tag: 'div' });

                $('.tl').animate({
                    scrollLeft: $('#timelineBoard').width()
                }, 'fast');  
            }

            $scope.tlWidth = marginLeft + 40;    
            
        });
    };

    var _resetBoard = function () {
        var divBfLine, divLine, divAfLine;

        // timelineBoard.remove();
        // divBfLine = document.createElement('div');
        // divLine = document.createElement('div');
        // divAfLine = document.createElement('div');

        // console.log('timelineBoard: ', timelineBoard);
        // divBfLine.setAttribute('class', 'tl-line bf');
        // divLine.setAttribute('class', 'tl-line');
        // divAfLine.setAttribute('class', 'tl-line af');


        $timeout(function () {
            $scope.boardLine = [];
            $scope.prevNote = [];
            $scope.countLine = 0;
            $scope.Score = 0;

            $( ".tl-active" ).remove();

            // timelineBoard.appendChild(divBfLine);
            // timelineBoard.appendChild(divLine);
            // timelineBoard.appendChild(divAfLine);

            // timelineBoard.removeChild(document.getElementsByTagName("div"));

        });
    };

    var _tick = function () {
        soundFront.send([0x99, tickCount ? 37 : 40, 127]);

        tickCount++; 
        tickCountAll++;

        if (tickCount >= $scope.midLists.numerator) tickCount = 0;
        $scope.befrPlay--;

        // console.log('tickCountAll: ', tickCountAll);

        timeout = $timeout(function() {
            if (tickCountAll >= $scope.timeOutBar && $scope.startCount === true && $scope.checkTiming === false) {
                _timeoutPractice();
            } else if ($scope.befrPlay !== 0 && $scope.checkTiming === true) {
                _tick();
            } else if ($scope.checkTiming === false) {
                _tick();
            } else {
                $timeout.cancel(timeout);
                $scope.befrPlay = $scope.midLists.numerator;
                audio.volume = 70/100;
                audio.play();
            }

            
            // if ($scope.befrPlay !== 0) {
                // _tick();
            // } else {
            //     $timeout.cancel(timeout);
            //     $scope.befrPlay = $scope.midLists.numerator;

            //     if ($scope.checkTiming === true) {
            //         audio.volume = 70/100;
            //         audio.play();
            //     } 
            //     else {
            //         _timeoutPractice();
            //     }
            // }
            
        }, 60000/$scope.midLists.tempo);
    };

    var _tickSync = function () {

        return $q(function (resolve, reject) {
            // soundFront.send([0x99, tickCount ? 37 : 40, 127]);
            soundFront.send([0x99, 37, 127]);

            tickCount++; 

            if (tickCount >= $scope.tickIntro) tickCount = 0;

            // $scope.befrPlay--;
            $scope.befrPlayIntro--;

            timeout = $timeout(function() {
                if ($scope.befrPlayIntro !== 0) {
                    resolve(_tickSync());
                } else {
                    $timeout.cancel(timeout);
                    // $scope.befrPlay = $scope.midLists.numerator;
                    $scope.befrPlayIntro = ((($scope.midLists.numerator/2)%1) === 0)? $scope.midLists.numerator/2: $scope.midLists.numerator;

                    resolve(true);
                }
            }, 60000/$scope.midLists.tempo);
        });
    };

    var _timeoutPractice = function () {
        var toSec = 14;

        // if ($scope.startCount === true && $scope.countNoteOn === 0) {
        //     toSec = 16;
        // } else if ($scope.startCount === true && $scope.countNoteOn !== 0) {
        //     toSec = 8;
        // }

        // $timeout(function () {
            // if ($scope.startCount === true && $scope.countNoteOn === 0) {
                noty({ text: 'Timeout', theme: 'relax', type: 'warning', layout: 'topRight', timeout: 1000, callback: {
                    onShow: function () {
                        _calculateScore($scope.midLists.orgNote.length, $scope.countNoteOn, $scope.Score);
                    }
                }});
            // }
        // }, toSec*1000);
    };

    var _calculateTime = function (ptTimed, timing) {
        if (ptTimed === 0 && Math.floor(timing) === 0) {
            return {
                perDif: 0,
                scoreTime: 1
            };
        } else {
            var scores = Math.floor((Math.abs(timing - ptTimed)/((timing + ptTimed)/2))*100), scoreTime;

            if (scores <= 5 && scores >= 0) {
                scoreTime = 1;
            } else if (scores <= 10 && scores > 5) {
                scoreTime = 1/2;
            } else if (scores <= 30 && scores > 10) {
                scoreTime = 1/3;
            } else {
                scoreTime = 1/4;
            }

            return {
                perDif: scores,
                scoreTime: scoreTime
            };
        }
    };

    var _calculateScore = function (orgScore, noteOn, getScore) {
        var scored = (Math.abs(getScore - (noteOn - getScore)))/ (orgScore),
            msgText = 'Great', 
            msgType = 'success',
            scoreTime = 0;

        if ($scope.checkTiming !== true) {
            scored = scored*100;
        } else {
            for (var i = 0; i < $scope.playNoted.length; i++) {
                var prop = $scope.playNoted[i];
                scoreTime += prop.timeScore;
            }
            
            console.log('bf.noteScored: ', scored);
            scored = scored/2;
            console.log('af.noteScored: ', scored);

            console.log('bf.timeScore: ', scoreTime);
            scoreTime = (scoreTime/orgScore)/2;
            console.log('af.timeScore: ', scoreTime);

            scored = (scored + scoreTime)*100;
        }

        scored = scored.toFixed(0);

        if (scored === 100) {
            msgText = 'Perfect';
            msgType = 'success';
        } else if (scored > 80) {
            msgText = 'Great';
            msgType = 'info';
        } else if (scored > 60) {
            msgText = 'Not bad';
            msgType = 'warning';
        } else {
            msgText = 'Try again';
            msgType = 'warning';
        }

        // console.log('$scope.playNoted: ', $scope.playNoted);
        var msg = '<p>Your score: ' + scored + '%</p>';
        msg += '<div class="note-score">';
        msg += '<ul>';
        msg += '<li><a class="btn btn-success btn-fab btn-fab-mini"><i class="material-icons">done</i></a> ' + $scope.correctNote + '</li>';
        msg += '<li><a class="btn btn-warning btn-fab btn-fab-mini"><i class="material-icons">clear</i></a> ' + $scope.wrongNote + '</li>';
        msg += '<li><a class="btn btn-default btn-fab btn-fab-mini"><i class="material-icons">remove</i></a> ' + Math.abs($scope.notePerBar - $scope.correctNote) + '</li>';
        msg += '</ul>';
        msg += '</div>';

        $scope.startCount = false;
        $timeout(function () {
            $timeout.cancel(timeout);

            SweetAlert.swal({ title: msgText, text: msg, type: msgType, html: true }, function(){ 
                $scope.$emit('beginLoading', true);
               // $scope.startPractice();
               // $scope.countCorrectNote = 0;
               // $timeout(function () {
                tickCount = 0;
                tickCountAll = 0;

                $scope.countNoteOn = 0;
                $scope.countLine = 0;
                $scope.notePlaying = 0;
                $scope.Score = 0;

                $scope.correctNote = 0;
                $scope.wrongNote = 0;

                // $scope.startCount = false;

                $scope.btnPractice = false;
                $scope.btnPlay = false;
                $scope.btnPause = false;
                $scope.btnStop = false;
                $scope.btnBack = false;

                $scope.dischkPlayAll = false;
                $scope.disChkLoop = false;
                $scope.disChkTiming = false;

                $scope.playPerBar = false;                
                // $timeout.cancel(timeout);
                // $scope.boardLine = $scope.prepareLine;

                // $('#board').animate({
                //     scrollTop: $('#tbBoard').height()
                // }, 'fast');
                $scope.$emit('endLoading');
               // }, 700);

            });

        }, 2*(60000/$scope.midLists.tempo));
        
    };

    $scope.playAudio = function () {
        // audio.currentTime = $scope.startTime
        // $timeout(function () {
            if ($scope.btnPlay === false || $scope.btnPause === false || $scope.btnStop === false) {
                audio.volume = 1;

                $scope.btnPractice = true;
                $scope.disChkTiming = true;

                if (audio.paused && pausing === false) {
                    audio.currentTime = $scope.startTime; 
                    audio.play();
                } else {
                    audio.play();
                }
            }

            // console.log($scope.disChkTiming);
        // });
    };

    $scope.pauseAudio = function () {
        if ($scope.btnPlay === false || $scope.btnPause === false || $scope.btnStop === false) {
            if (!audio.paused) {
                pausing = true;
                audio.pause();
            }
        }
    };

    $scope.stopAudio = function () {
        if ($scope.btnPlay === false || $scope.btnPause === false || $scope.btnStop === false) {
            audio.load();
            pausing = false;

            $scope.btnPlay = false;
            $scope.btnPause = false;
            $scope.btnStop = false;
            $scope.btnPractice = false;

            $scope.disChkTiming = false;
        }
    };



    $scope.togglePlayAll = function (playAll) {
        $timeout(function () {
            $scope.playAll = playAll;
            if ($scope.playAll === true) {
                $scope.slider.value = '0;' + audio.duration;
                $scope.startTime = 0;
                $scope.endTime = audio.duration;
                // $scope.barSelected.length = 0;
                // $('.bar').has('li').find('a').removeAttr('style').removeAttr('active');
            }
        });
    };

    $scope.toggleLoop = function (loop) {
        $scope.loop = loop;
    };

    $scope.toggleCheckTiming = function (chkTiming) {
        $scope.checkTiming = chkTiming;
    };


    $scope.playBar = function () {
        // console.log($scope.midLists.tracks[$scope.curTrack]);
        $scope.countNoteOn = 0;
        $scope.countLine = 0;
        $scope.notePlaying = 0;
        $scope.Score = 0;

        $scope.startCount = false;

        $scope.btnPractice = false;
        $scope.btnPlay = false;
        $scope.btnPause = false;
        $scope.btnStop = false;
        $scope.btnBack = false;

        $scope.playPerBar = true;
        
        audio.currentTime = Math.floor($scope.midLists.tracks[$scope.curTrack].start);
        $scope.endTime = Math.floor($scope.midLists.tracks[$scope.curTrack].end - cutNoteEnd);
        $scope.timeOutBar = Math.floor(($scope.midLists.tracks[$scope.curTrack].end - $scope.midLists.tracks[$scope.curTrack].start)%10 + $scope.midLists.numerator*2);
        $scope.notePerBar = $scope.midLists.tracks[$scope.curTrack].notes.length;
        console.log('$scope.playBar:$scope.timeOutBar: ', $scope.timeOutBar);
        // audio.currentTime = $scope.midLists.tracks[$scope.curTrack].start;
        // audio.duration = $scope.midLists.tracks[$scope.curTrack].end;
        // $scope.endTime = $scope.midLists.tracks[$scope.curTrack].end;

        $scope.prevTrack = (($scope.curTrack - 1) < 0)? 0: $scope.curTrack - 1;
        $scope.nextTrack = (($scope.curTrack + 1) >= $scope.midLists.tracks[$scope.midLists.tracks.length-1])? $scope.midLists.tracks[$scope.midLists.tracks.length-1]: $scope.curTrack + 1;


        _tickSync().then(function (rs) {
            audio.play();
        });
    };

    /************ Backfard **********/
    // $scope.reWindBar = function () {
    //     $scope.playPerBar = true;
    //     $scope.curTrack = $scope.prevTrack;

    //     audio.currentTime = Math.floor($scope.midLists.tracks[$scope.curTrack].start);
    //     $scope.endTime = Math.floor($scope.midLists.tracks[$scope.curTrack].end - cutNoteEnd);

    //     $scope.prevTrack = (($scope.curTrack - 1) < 0)? 0: $scope.curTrack - 1;
    //     $scope.nextTrack = (($scope.curTrack + 1) >= $scope.midLists.tracks[$scope.midLists.tracks.length-1])? $scope.midLists.tracks[$scope.midLists.tracks.length-1]: $scope.curTrack + 1;
    //     audio.play();
    // };

    $scope.forwardBar = function () {
        $scope.countNoteOn = 0;
        $scope.countLine = 0;
        $scope.notePlaying = 0;
        $scope.Score = 0;

        $scope.startCount = false;

        $scope.btnPractice = false;
        $scope.btnPlay = false;
        $scope.btnPause = false;
        $scope.btnStop = false;
        $scope.btnBack = false;
        
        $scope.playPerBar = true;
        $scope.curTrack = $scope.nextTrack;

        if ($scope.curTrack > ($scope.midLists.tracks.length - 1)) {
            $scope.curTrack = 0;
        }

        audio.currentTime = Math.floor($scope.midLists.tracks[$scope.curTrack].start);
        $scope.endTime = Math.floor($scope.midLists.tracks[$scope.curTrack].end - cutNoteEnd);

        $scope.timeOutBar = Math.floor(($scope.midLists.tracks[$scope.curTrack].end - $scope.midLists.tracks[$scope.curTrack].start)%10 + $scope.midLists.numerator*2);
        $scope.notePerBar = $scope.midLists.tracks[$scope.curTrack].notes.length;
         // audio.currentTime = $scope.midLists.tracks[$scope.curTrack].start;
        // $scope.endTime = $scope.midLists.tracks[$scope.curTrack].end;
        // console.log('$scope.endTime: ', $scope.endTime);
        $scope.prevTrack = (($scope.curTrack - 1) < 0)? 0: $scope.curTrack - 1;
        $scope.nextTrack = (($scope.curTrack + 1) >= $scope.midLists.tracks[$scope.midLists.tracks.length-1])? $scope.midLists.tracks[$scope.midLists.tracks.length-1]: $scope.curTrack + 1;

         _tickSync().then(function (rs) {
            audio.play();
        });
    };

    $scope.startPractice = function () {
        $scope.playPerBar = false;
        $scope.startCount = !$scope.startCount;

        if ($scope.startCount === true && $scope.btnPractice === false) {
            $scope.playNoted.length = 0;

            $scope.btnPlay = true;
            $scope.btnPause = true;
            $scope.btnStop = true;
            $scope.btnBack = true;

            $scope.displayAll = true;
            $scope.disLoop = true;
            $scope.disChkTiming = true;

            $scope.notePerBar = $scope.midLists.noteOnCount;
            $scope.timeOutBar = Math.round(audio.duration + $scope.midLists.numerator*8);

            noty({ text: 'Let\'s Start', theme: 'relax', type: 'alert', layout: 'topRight', timeout: 1000, callback: {
                onShow: function () {
                    _resetBoard();
                    _tick();
                    // audio.play();
                    // _timeoutPractice();
                    // $scope.btnPractice = true;
                }
            }});
        } else {
            // $scope.btnPractice = false;
        }
    };

    $scope.startPracticeSplit = function () {
        $scope.startCount = !$scope.startCount;

        if ($scope.startCount === true && $scope.btnPractice === false) {
            $scope.playNoted.length = 0;

            $scope.btnPlay = true;
            $scope.btnPause = true;
            $scope.btnStop = true;
            $scope.btnBack = true;

            $scope.displayAll = true;
            $scope.disLoop = true;
            $scope.disChkTiming = true;

            noty({ text: 'Let\'s Start', theme: 'relax', type: 'alert', layout: 'topRight', timeout: 1000, callback: {
                onShow: function () {
                    _resetBoard();
                    _tick();
                    // audio.play();
                    // _timeoutPractice();
                    // $scope.btnPractice = true;
                }
            }});
        } else {
            // $scope.btnPractice = false;
        }
    };

    $scope.stopPractice = function () {
        $scope.countNoteOn = 0;
        $scope.countLine = 0;
        $scope.notePlaying = 0;
        $scope.Score = 0;

        $scope.startCount = false;

        $scope.btnPractice = false;
        $scope.btnPlay = false;
        $scope.btnPause = false;
        $scope.btnStop = false;
        $scope.btnBack = false;

        $scope.dischkPlayAll = false;
        $scope.disChkLoop = false;
        $scope.disChkTiming = false;

        $scope.stopAudio();
    };

    $scope.$watch('barSelected', function (newVal, oldVal) {
        $timeout(function () {
            if (newVal !== oldVal && newVal.length === 0) {
                $scope.startTime = 0;
                $scope.endTime = 0;
                audio.load();
            }
        });
    }, true);

    $scope.$watch('midLists', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            _setKeyNote();
        }
    });

}]);