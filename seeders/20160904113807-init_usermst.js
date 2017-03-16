'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        var users = [
            { usr_id: 1, usr_title: 'admin', usr_passwd: 'password', usr_role_id: 1, usr_active: 1},
            { usr_id: 2, usr_title: 'staff1', usr_passwd: 'password', usr_role_id: 2, usr_active: 1},
            { usr_id: 3, usr_title: 'staff2', usr_passwd: 'password', usr_role_id: 3, usr_active: 1},
            { usr_id: 4, usr_title: 'student1', usr_passwd: 'password', usr_role_id: 6, usr_active: 1},
            { usr_id: 5, usr_title: 'student2', usr_passwd: 'password', usr_role_id: 6, usr_active: 1},
            { usr_id: 6, usr_title: 'teacher1', usr_passwd: 'password', usr_role_id: 4, usr_active: 1},
            { usr_id: 7, usr_title: 'teacher2', usr_passwd: 'password', usr_role_id: 4, usr_active: 1}
        ];

        // { usr_id: 2, usr_title: 'teacher', usr_passwd: 'password', usr_role_id: 2, usr_active: 1},
        // { usr_id: 3, usr_title: 'student', usr_passwd: 'password', usr_role_id: 3, usr_active: 1}

        return queryInterface.bulkInsert('usermst', users, { ignoreDuplicates: true });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('usermst', null);
    }
};