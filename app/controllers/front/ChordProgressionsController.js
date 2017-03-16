"use strict";

controllers.controller('ChordProgressionsController', 
    ['$rootScope', '$routeParams', '$scope', '$q', '$filter', '$timeout', 'MidiService', 'ScalesService', 'LocalDBService', 'SweetAlert', 
    function ($rootScope, $routeParams, $scope, $q, $filter, $timeout, Mid, Scales, LocalDB, SweetAlert) { 

    JZZ.synth.MIDIjs.register(0, { soundfontUrl: "soundfont/", instrument: ["acoustic_grand_piano"] });
    var soundFront = JZZ().openMidiOut(0).or(function(){
            console.log('Cannot open MIDI port!');
        }),
        notes = ['C5','D5','E5','F5','G5','A5','B5','C6','D6','E6','F6','G6','A6','B6'],
        timeout, quaterNote = 4, qbw = 0;


    $rootScope.requireUI = true;

    $scope.chordProgressions1 = true;
    $scope.chordProgressions2 = false;
    $scope.chordProgressions3 = false;

    $scope.chords = 1;
    $scope.progress = 0;
    $scope.countQuiz = 0;
    $scope.startQuiz = false;
    $scope.displayNextBtn = false;

    $scope.corrected = true;
    $scope.prevQuiz = [];
    $scope.curQuiz = [];

    $scope.choices1 = [];
    $scope.choices2 = [];
    $scope.choices3 = [];
    $scope.choices4 = [];
    $scope.choicesCorrect = true;
    $scope.choicesClick = 1;
    $scope.prevChoices = [];
    $scope.quizRs = [1];

    $scope.slowSpeed = false;
    $scope.mediumSpeed = true;
    $scope.fastSpeed = false;
    $scope.speed = 800;

    $scope.hearDisabled = false;

    $scope.hear = 'Hear First Question';

    $scope.chordsOptions = {
        data: [
            { id: 1, text: 'Simple Triads (I, IV, V)' },
            { id: 2, text: 'All Triads (I, ii, iii, IV, V, vi)' },
            { id: 3, text: 'Triades and Sevenths' }
        ]};

    $scope.chordProgression = {
        triads: [
            { id: 1, text: 'I', active: false },
            { id: 2, text: 'ii', active: false },
            { id: 3, text: 'iii', active: false },
            { id: 4, text: 'iv', active: false },
            { id: 5, text: 'V', active: false },
            { id: 6, text: 'vi', active: false },
            { id: 7, text: 'vii', active: false }
        ],
        sevenths: [
            { id: 8, text: 'Imaj7', active: false },
            { id: 9, text: 'iim7', active: false },
            { id: 10, text: 'iiim7', active: false },
            { id: 11, text: 'IVmaj7', active: false },
            { id: 12, text: 'V7', active: false },
            { id: 13, text: 'vim7', active: false }
        ]
    };

    var _loadChoices = function () {
        $scope.choices1 = [];
        $scope.choices2 = [];
        $scope.choices3 = [];
        $scope.choices4 = [];

        for (var i in $scope.chordProgression.triads) {
            if ($scope.chordProgression.triads[i].active === true) {
                $scope.choices1.push({ id: $scope.chordProgression.triads[i].id, text: $scope.chordProgression.triads[i].text, active: false, correct: false });
                $scope.choices2.push({ id: $scope.chordProgression.triads[i].id, text: $scope.chordProgression.triads[i].text, active: false, correct: false });
                $scope.choices3.push({ id: $scope.chordProgression.triads[i].id, text: $scope.chordProgression.triads[i].text, active: false, correct: false });
                $scope.choices4.push({ id: $scope.chordProgression.triads[i].id, text: $scope.chordProgression.triads[i].text, active: false, correct: false });
            }
        }

        for (var i in $scope.chordProgression.sevenths) {
            if ($scope.chordProgression.sevenths[i].active === true) {
                $scope.choices1.push({ id: $scope.chordProgression.sevenths[i].id,text: $scope.chordProgression.sevenths[i].text, active: false, correct: false });
                $scope.choices2.push({ id: $scope.chordProgression.sevenths[i].id,text: $scope.chordProgression.sevenths[i].text, active: false, correct: false });
                $scope.choices3.push({ id: $scope.chordProgression.sevenths[i].id,text: $scope.chordProgression.sevenths[i].text, active: false, correct: false });
                $scope.choices4.push({ id: $scope.chordProgression.sevenths[i].id,text: $scope.chordProgression.sevenths[i].text, active: false, correct: false });
            }
        }
    };


    $scope.chooseChords = function () {

        $scope.chordProgressions1 = false;
        $scope.chordProgressions2 = true;
        $scope.chordProgressions3 = false;

        $scope.chordsTitle = $scope.chordsOptions.data[$scope.chords-1].text;

        switch($scope.chords) {
            case 1:
                $scope.chordProgression.triads[0].active = true;
                $scope.chordProgression.triads[1].active = false;
                $scope.chordProgression.triads[2].active = false;
                $scope.chordProgression.triads[3].active = true;
                $scope.chordProgression.triads[4].active = true;
                $scope.chordProgression.triads[5].active = false;
                $scope.chordProgression.triads[5].active = false;
                $scope.chordProgression.triads[6].active = false;

                $scope.chordProgression.sevenths[0].active = false;
                $scope.chordProgression.sevenths[1].active = false;
                $scope.chordProgression.sevenths[2].active = false;
                $scope.chordProgression.sevenths[3].active = false;
                $scope.chordProgression.sevenths[4].active = false;
                $scope.chordProgression.sevenths[5].active = false;
                break;
            case 2:
                $scope.chordProgression.triads[0].active = true;
                $scope.chordProgression.triads[1].active = true;
                $scope.chordProgression.triads[2].active = true;
                $scope.chordProgression.triads[3].active = true;
                $scope.chordProgression.triads[4].active = true;
                $scope.chordProgression.triads[5].active = true;
                $scope.chordProgression.triads[5].active = true;
                $scope.chordProgression.triads[6].active = false;

                $scope.chordProgression.sevenths[0].active = false;
                $scope.chordProgression.sevenths[1].active = false;
                $scope.chordProgression.sevenths[2].active = false;
                $scope.chordProgression.sevenths[3].active = false;
                $scope.chordProgression.sevenths[4].active = false;
                $scope.chordProgression.sevenths[5].active = false;
                break;
            case 3:
                $scope.chordProgression.triads[0].active = true;
                $scope.chordProgression.triads[1].active = true;
                $scope.chordProgression.triads[2].active = true;
                $scope.chordProgression.triads[3].active = true;
                $scope.chordProgression.triads[4].active = true;
                $scope.chordProgression.triads[5].active = true;
                $scope.chordProgression.triads[5].active = true;
                $scope.chordProgression.triads[6].active = false;

                $scope.chordProgression.sevenths[0].active = true;
                $scope.chordProgression.sevenths[1].active = true;
                $scope.chordProgression.sevenths[2].active = true;
                $scope.chordProgression.sevenths[3].active = true;
                $scope.chordProgression.sevenths[4].active = true;
                $scope.chordProgression.sevenths[5].active = true;
                break;
        }

        _loadChoices();
    };

    var _checkPrevChoices = function (choice) {
        if ($scope.prevChoices.length > 0) {
            for (var i in $scope.prevChoices) {
                if ($scope.prevChoices[i] === choice) {
                    return true
                }
            }
        }
        
        return false;
    };

    $scope.checkChord = function (choice, chord) {
        if ($scope.displayNextBtn === false) {
            // if (_checkPrevChoices(choice) === false) {
                chord.active = true;
                if ($scope.curQuiz[choice - 1] === chord.id) {
                    chord.correct = true;
                    $scope.choicesClick++;
                    $scope.quizRs[choice - 1] = $scope.curQuiz[choice - 1];
                    // $scope.prevChoices.push(choice);
                } else {
                    if ($scope.choicesCorrect === true)  {
                        chord.correct = false;
                        $scope.choicesCorrect = false;
                        $scope.progress = ($scope.progress > 0)? $scope.progress - 1: 0;
                    }
                }
            // }
        }
    };

    var _playChord = function (quizzes) {
        // var randNote = quizzes[Math.floor(Math.random()*quizzes.length)];
        if (quaterNote === 4) {
            // if ($scope.corrected === true) {
            //     $scope.curQuiz.push(1);
            // }

            soundFront.send(0x90, notes[1 - 1], 100).send(0x90, notes[3 - 1], 100).send(0x90, notes[5 - 1], 100);
            quaterNote--;
            qbw++;
        } else {
            quaterNote--;
            
            // var randNote = quizzes[Math.floor(Math.random()*quizzes.length)];
            switch ($scope.curQuiz[qbw]) {
                case 1:
                    soundFront.send(0x90, notes[1 - 1], 100).send(0x90, notes[3 - 1], 100).send(0x90, notes[5 - 1], 100);
                    break;
                case 2:
                    soundFront.send(0x90, notes[2 - 1], 100).send(0x90, notes[4 - 1], 100).send(0x90, notes[6 - 1], 100);
                    break;
                case 3:
                    soundFront.send(0x90, notes[3 - 1], 100).send(0x90, notes[5 - 1], 100).send(0x90, notes[7 - 1], 100);
                    break;
                case 4:
                    soundFront.send(0x90, notes[4 - 1], 100).send(0x90, notes[6 - 1], 100).send(0x90, notes[8 - 1], 100);
                    break;
                case 5:
                    soundFront.send(0x90, notes[5 - 1], 100).send(0x90, notes[7 - 1], 100).send(0x90, notes[9 - 1], 100);
                    break;
                case 6:
                    soundFront.send(0x90, notes[6 - 1], 100).send(0x90, notes[8 - 1], 100).send(0x90, notes[10 - 1], 100);
                    break;
                case 7:
                    soundFront.send(0x90, notes[7 - 1], 100).send(0x90, notes[9 - 1], 100).send(0x90, notes[11 - 1], 100);
                    break;
                case 8:
                    soundFront.send(0x90, notes[1 - 1], 100).send(0x90, notes[3 - 1], 100).send(0x90, notes[5 - 1], 100).send(0x90, notes[7 - 1], 100);
                    break;
                case 9:
                    soundFront.send(0x90, notes[2 - 1], 100).send(0x90, notes[4 - 1], 100).send(0x90, notes[6 - 1], 100).send(0x90, notes[8 - 1], 100);
                    break;
                case 10:
                    soundFront.send(0x90, notes[3 - 1], 100).send(0x90, notes[5 - 1], 100).send(0x90, notes[7 - 1], 100).send(0x90, notes[9 - 1], 100);
                    break;
                case 11:
                    soundFront.send(0x90, notes[4 - 1], 100).send(0x90, notes[6 - 1], 100).send(0x90, notes[8 - 1], 100).send(0x90, notes[10 - 1], 100);
                    break;
                case 12:
                    soundFront.send(0x90, notes[5 - 1], 100).send(0x90, notes[7 - 1], 100).send(0x90, notes[9 - 1], 100).send(0x90, notes[11 - 1], 100);
                    break;
                case 13:
                    soundFront.send(0x90, notes[6 - 1], 100).send(0x90, notes[8 - 1], 100).send(0x90, notes[10 - 1], 100).send(0x90, notes[12 - 1], 100);
                    break;
            }

            qbw++;

            // if ($scope.corrected === true) {
            //     $scope.curQuiz.push(randNote);
            // }
        }

        timeout = $timeout(function () {
            if (quaterNote !== 0) {
                _playChord(quizzes);
                $scope.hearDisabled = true;
            } else {
                $timeout.cancel(timeout);
                quaterNote = 4;
                qbw = 0;
                $scope.hearDisabled = false;
                console.log($scope.curQuiz);
            }
        }, $scope.speed);
    };

    var _quizIdentical = function (a, b) {
        var i = a.length;
        if (i != b.length) return false;
        while (i--) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };

    $scope.speedChange = function (target) {
        switch (target) {
            case 'slowSpeed':
                $scope.slowSpeed = true;
                $scope.mediumSpeed = false;
                $scope.fastSpeed = false;
                $scope.speed = 1200;
                break;
            case 'mediumSpeed':
                $scope.slowSpeed = false;
                $scope.mediumSpeed = true;
                $scope.fastSpeed = false;
                $scope.speed = 800;
                break;
            case 'fastSpeed':
                $scope.slowSpeed = false;
                $scope.mediumSpeed = false;
                $scope.fastSpeed = true;
                $scope.speed = 400;
                break;
            default:
                $scope.slowSpeed = false;
                $scope.mediumSpeed = true;
                $scope.fastSpeed = false;
                $scope.speed = 800;
                break;
        }
    }

    $scope.hearQuestion = function () {
        if ($scope.hearDisabled === false) {
            $scope.startQuiz = true;

            var quizzes = [];

            for (var i in $scope.chordProgression.triads) {
                if ($scope.chordProgression.triads[i].active === true) {
                    quizzes.push($scope.chordProgression.triads[i].id);
                }
            }

            for (var i in $scope.chordProgression.sevenths) {
                if ($scope.chordProgression.sevenths[i].active === true) {
                    quizzes.push($scope.chordProgression.sevenths[i].id);
                }
            }

            if ($scope.corrected === true) {
                 $scope.curQuiz.push(1);

                for (var q = 1; q <= quaterNote; q++) {
                    if (q !== 1) {
                        $scope.curQuiz.push(quizzes[Math.floor(Math.random()*quizzes.length)]);
                    } 
                }
            }

            // if (_quizIdentical($scope.prevQuiz, $scope.curQuiz) === true) {
            //     if ($scope.corrected === true) {
            //          $scope.curQuiz.push(1);

            //         for (var q = 1; q <= quaterNote; q++) {
            //             if (q !== 1) {
            //                 $scope.curQuiz.push(quizzes[Math.floor(Math.random()*quizzes.length)]);
            //             } 
            //         }
            //     }
            // } else {
                $scope.corrected = false;
                _playChord(quizzes);
            // }
        }  
        
    };

    $scope.nextQuest = function () {
        if ($scope.hearDisabled === false) {
            $scope.corrected = true;
            $scope.prevQuiz = $scope.curQuiz;
            $scope.curQuiz.length = 0;
            _loadChoices();
            $scope.hearQuestion();
            $scope.displayNextBtn = false;
        }
    };

    $scope.endQuiz = function () {
        $scope.chordProgressions1 = true;
        $scope.chordProgressions2 = false;
        $scope.chordProgressions3 = false;

        $scope.chords = 1;
        $scope.progress = 0;
        $scope.countQuiz = 0;
        $scope.startQuiz = false;
        $scope.displayNextBtn = false;

        $scope.corrected = true;
        $scope.prevQuiz = [];
        $scope.curQuiz = [];

        $scope.choices1 = [];
        $scope.choices2 = [];
        $scope.choices3 = [];
        $scope.choices4 = [];
        $scope.choicesCorrect = true;
        $scope.choicesClick = 1;
        $scope.prevChoices = [];
        $scope.quizRs = [1];

        $scope.slowSpeed = false;
        $scope.mediumSpeed = true;
        $scope.fastSpeed = false;
        $scope.speed = 800;

        $scope.hearDisabled = false;

        $scope.hear = 'Hear First Question';

    };

    $scope.$watch('choicesClick', function (newVal, oldVal) {
        if (newVal !== oldVal && $scope.choicesClick === 4) {
            // console.log('_quizIdentical: ', _quizIdentical($scope.curQuiz, $scope.quizRs));
            if (_quizIdentical($scope.curQuiz, $scope.quizRs) === true) {
                if ($scope.choicesCorrect === true) {
                    $scope.progress = $scope.progress + 1;
                }
                
                $scope.displayNextBtn = true;
                // _loadChoices();
                $scope.countQuiz = $scope.countQuiz + 1;
                $scope.choicesClick = 1;
                $scope.prevChoices.length = 0;
                $scope.quizRs [1];
                $scope.choicesCorrect = true;

            }
        }
    });


    $scope.$watch('chordProgression', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            _loadChoices();
        }
    }, true);

}]);