'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        var storage = 'storage';
        if (queryInterface.sequelize.options.env === 'development') {
            storage = storage + '_' + queryInterface.sequelize.options.env;
        }

        var lessons = [
            {   
                ls_id: 1, 
                ls_title: 'C Major and Arpeggio', 
                ls_lsg_id: 1, 
                ls_midi_path: storage + '/media/midi/CMajorArpeggio.midi', 
                ls_mpeg_path: storage + '/media/mpeg/CMajorArpeggio.mp3', 
                ls_sort: 1, 
                ls_active: 1 
            },
            {   
                ls_id: 2, 
                ls_title: 'Three Note Left Hand', 
                ls_lsg_id: 1, 
                ls_midi_path: storage + '/media/midi/ThreeNoteLeftHand.midi', 
                ls_mpeg_path: storage + '/media/mpeg/ThreeNoteLeftHand.mp3', 
                ls_sort: 2, 
                ls_active: 1 
            },
            {   
                ls_id: 3, 
                ls_title: 'Split bar example', 
                ls_lsg_id: 1, 
                ls_midi_path: storage + '/media/midi/trimExample.mid', 
                ls_mpeg_path: storage + '/media/mpeg/trimExample.mp3', 
                ls_sort: 3, 
                ls_active: 1 
            }];

        return queryInterface.bulkInsert('lessonmst', lessons, { ignoreDuplicates: true });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('lessonmst', null);
    }
};