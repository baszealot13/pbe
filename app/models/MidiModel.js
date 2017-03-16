"use strict";

function MidiModel() {
    var self = this;

    self.notes = ['C','C#','D','Eb','E','F','F#','G','G#','A','Bb','B'];

    self.load = function () {
        if (window.navigator.requestMIDIAccess) {
            window.navigator.requestMIDIAccess().then(function (midiAccess) {
                var haveAtLeastOneDevice = false,
                    inputs = midiAccess.inputs.values();

                for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                    input.value.onmidimessage = self.MIDIMessageEventHandler;
                    haveAtLeastOneDevice = true;
                }

                if (!haveAtLeastOneDevice) {
                    alert("No MIDI input devices present.");
                } 
                else {
                    console.log('MIDI Ready!');
                    // alert("MIDI Ready!");
                }
            }, function (err) {
                console.log("The MIDI system failed to start.");
            });
        } else {
            alert("No MIDI support present in your browser.");
        }  
    };

    self.bufferToBase64 = function (buf) {
        var binstr = Array.prototype.map.call(buf, function (ch) {
            return String.fromCharCode(ch);
        }).join('');

        return btoa(binstr);
    };

    self.convertMid = function (buffer) {
        var uInt = new Uint8Array(buffer),
            base64 = this.bufferToBase64(uInt);
        // return 'data:audio/mpeg;base64,' + base64;
        return base64;
    };

    self.midLoad = function (buffer) {
        var self = this,
            player = MIDI.Player;

        player.timeWarp = 1; 

        return new Promise(function (resolve, reject) {
            player.loadFile('data:audio/midi;base64,' + buffer, function() {
                // resolve(player.replayer.getData());
                // console.log(player.replayer.getData());
                resolve(self.getMidList(player.replayer.getData()));
            });
        });
    };

    self.getMidList = function (midData) {
        var self = this,
            ppqn = 480,
            milliseconds = 60000,
            tempo = 0,  // tempo=(60000/microsecondsPerBeat)*1000
            numerator = 4,
            denominator = 4, // numerator/denominator
            queuedTime = 0,
            deltaTimePlus = 0,
            currentTime = 0,
            noteOnCount = 0,
            noteOffCount = 0,
            midLists = {
                ppqn: ppqn,
                ppqPerBars: 0,
                bps: 60, // bit per secounds
                numerator: 0,
                denominator: 0,
                tempo: 0,
                lists: [],
                noteOnCount: 0,
                noteOffCount: 0,
                orgNote: [],
                orgNoteNum: [],
                tracks: []
            },
            trackIndex = 0,
            notes = [];

        return new Promise(function (resolve, reject) {
            // console.log(midData);
            for (var i = 0; i < midData.length; i++) {
                // console.log('midData[i][0]: ', midData[i][0]);
                // console.log('deltaTime: ', midData[i][1]);
                var midEvt = midData[i][0].event,
                    midTrack = midData[i][0].track,
                    tmp, tracked;

                if (midEvt.subtype === 'setTempo') {
                    midLists.tempo = Math.floor((milliseconds/midEvt.microsecondsPerBeat) * 1000);
                    midLists.bps = midLists.bps/midLists.tempo;
                    console.log('midLists.bps: ', midLists.bps);
                }

                if (midEvt.subtype === 'timeSignature') {
                    midLists.numerator = midEvt.numerator;
                    midLists.denominator = midEvt.denominator;
                    midLists.ppqPerBars = ppqn*midEvt.numerator;
                }

                if (midEvt.channel === 0) {
                    // console.log('midEvt: ', midEvt);
                    // console.log('bf.queuedTime: ', queuedTime);
                    queuedTime +=  self.calculateNoteToTime(Math.floor(midData[i][1]), midLists.ppqn, midLists.bps) * 1000// ((Math.floor(midData[i][1])/midLists.ppqn) * midLists.bps) * 1000;

                    // console.log('queuedTime: ', queuedTime/1000);

                    deltaTimePlus += Math.floor(midData[i][1]);

                    currentTime = queuedTime;

                    var tempObj = {
                        track: midTrack,
                        deltaTime: Math.floor(midData[i][1]),
                        deltaTimePlus: deltaTimePlus,
                        time: (currentTime / 1000),
                        status: midEvt.subtype,
                        noteNumber: midEvt.noteNumber,
                        noteText: self.notes[midEvt.noteNumber % 12] + Math.floor(midEvt.noteNumber / 12),
                        velocity: midEvt.velocity,
                    };

                    if (midEvt.subtype === 'noteOn') {
                        tempObj.noteStatus = midEvt.subtype;
                        midLists.lists.push(tempObj);
                        midLists.orgNote.push({ noteNum: tempObj.noteNumber, noteText: tempObj.noteText, time: tempObj.time, track: midTrack });
                        midLists.orgNoteNum.push(tempObj.noteNumber);
                        noteOnCount++;
                    } else if (midEvt.subtype === 'noteOff') {
                        tempObj.noteStatus = midEvt.subtype;
                        midLists.lists.push(tempObj);
                        noteOffCount++;
                    }
                }
            }

            for (var t = 0; t < midLists.lists.length; t++) {
                var track = midLists.lists[t].track, prevTrack, index = 0;

                if (track !== prevTrack) {
                    midLists.tracks.push({
                        track: midLists.lists[t].track,
                        notes: notes,
                        start: midLists.lists[t].time
                    });

                    if ((t - 1) >= 0) {
                        midLists.tracks[trackIndex - 1].end = midLists.lists[t - 1].time;
                    }

                    trackIndex++;
                }

                prevTrack = track;
            }

            midLists.tracks[midLists.tracks.length-1].end = midLists.lists[midLists.lists.length-1].time;


            for (var t = 0; t < midLists.tracks.length; t++) {
                var notes = [];
                for (var n = 0; n < midLists.orgNote.length; n++) {
                    if (midLists.orgNote[n].track === midLists.tracks[t].track) {
                        notes.push({
                            noteNum: midLists.orgNote[n].noteNum,
                            noteText: midLists.orgNote[n].noteText,
                            time: midLists.orgNote[n].time
                        });
                    }
                }
                midLists.tracks[t].notes = notes;
            }

            midLists.noteOnCount = noteOnCount;
            midLists.noteOffCount = noteOffCount;

            resolve(midLists);

        });
    };

    self.calculateNoteToTime = function (deltaTime, ppqn, bps) {
        // console.log('deltaTime: ', deltaTime);
        return (deltaTime/ppqn) * bps;
    };
};