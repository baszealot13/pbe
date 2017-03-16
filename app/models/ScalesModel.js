"use strict";

function ScalesModel() {

    this.pattern = function (scales) {
        var allScale = {
                'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
                'C#': ['C#', 'Eb', 'F', 'F#', 'G#', 'Bb', 'C'],
                'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
                'Eb': ['Eb', 'F', 'G#', 'A', 'Bb', 'C', 'D'],
                'E': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'Eb'],
                'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
                'F#': ['F#', 'G#', 'Bb', 'B', 'C#', 'Eb', 'F'],
                'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
                'G#': ['G#', 'Bb', 'C', 'C#', 'Eb', 'F', 'G'],
                'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
                'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
                'B': ['B', 'C#', 'Eb', 'E', 'F#', 'G#', 'Bb']
            },
            note = ['C','C#','D','Eb','E','F','F#','G','G#','A','Bb','B'];

        for (var i in allScale) {
            var match = 0;
            for (var j in scales) {
                // if (allScale[i].indexOf(scales[j]) >= 0) {
                if (typeof allScale[i][j] !== 'undifined' && allScale[i][j] === note[scales[j]%12]) {
                    // console.log('allScale[i][j]: ', allScale[i][j]);
                    // console.log('scales[j]: ', note[scales[j]%12]);
                    // console.log('matced')
                    match++
                }
            }
            // console.log('match: ', match);

            if (match < 3) {
                match = 0;
            } else {
                return { 
                    scale: i,
                    notes: [
                        { key: allScale[i][0], type: 1 },
                        { key: allScale[i][1], type: 2 },
                        { key: allScale[i][2], type: 2 },
                        { key: allScale[i][3], type: 3 },
                        { key: allScale[i][4], type: 2 },
                        { key: allScale[i][5], type: 2 },
                        { key: allScale[i][6], type: 3 }
                    ]};
                break;
            }
        }

        return null;
    };

    this.findDuplicateArray = function (arr) {
        var result = [],
            obj ={};

        arr = arr.sort();
        
        for (var i = 0; i < arr.length; i++) {
            obj[arr[i]] = 0;
        }

        for (var i in obj) {
            result.push(i);
        }

        return result;
    }

    return this;
}