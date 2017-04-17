'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        // console.log('lesson.queryInterface: ', queryInterface);
        var storage = 'storage',
            env = 'development';

        process.argv.forEach(function (val, index) {
            if (val === '--env') {
                env = process.argv[index + 1];
            }
        });

        if (env !== 'production') {
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

        if (env === 'development') {
            return queryInterface.bulkInsert('lessonmst', lessons, { ignoreDuplicates: true });
        } else {
            return null;
        }
    },
    down: function (queryInterface, Sequelize) {
        var env = 'development';

        process.argv.forEach(function (val, index) {
            if (val === '--env') {
                env = process.argv[index + 1];
            }
        });

        if (env === 'development') {
            return queryInterface.bulkDelete('lessonmst', null);
        } else {
            return null;
        }
    }
};