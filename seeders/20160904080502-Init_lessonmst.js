'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        var storage = 'storage';
        if (queryInterface.sequelize.options.env !== 'production') {
            storage = storage + '_development';
        }

        var lessons = [{   
                ls_id: 1, 
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