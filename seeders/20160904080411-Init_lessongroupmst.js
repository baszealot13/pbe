'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        var lsGroup = [
            { lsg_id: 1,  lsg_title: 'BEGIN 1',  lsg_sort: 1,  lsg_active: 1 },
            { lsg_id: 2,  lsg_title: 'BEGIN 2',  lsg_sort: 2,  lsg_active: 1 },
            { lsg_id: 3,  lsg_title: 'BEGIN 3',  lsg_sort: 3,  lsg_active: 1 },
            { lsg_id: 4,  lsg_title: 'BEGIN 4',  lsg_sort: 4,  lsg_active: 1 },
            { lsg_id: 5,  lsg_title: 'BEGIN 5',  lsg_sort: 5,  lsg_active: 1 },
            { lsg_id: 6,  lsg_title: 'ADVANCED 1',  lsg_sort: 6,  lsg_active: 1 },
            { lsg_id: 7,  lsg_title: 'ADVANCED 2',  lsg_sort: 7,  lsg_active: 1 },
            { lsg_id: 8,  lsg_title: 'ADVANCED 3',  lsg_sort: 8,  lsg_active: 1 },
            { lsg_id: 9,  lsg_title: 'PROFESSIONAL 1',  lsg_sort: 9,  lsg_active: 1 },
            { lsg_id: 10,  lsg_title: 'PROFESSIONAL 2',  lsg_sort: 10,  lsg_active: 1 }
        ];

        return queryInterface.bulkInsert('lessongroupmst', lsGroup, { ignoreDuplicates: true });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('lessongroupmst', null);
    }
};