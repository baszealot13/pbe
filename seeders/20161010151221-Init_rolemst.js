'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        var roles = [
            { role_id: 1, role_title: 'Administrator', role_home_path: '/Administrator' },
            { role_id: 2, role_title: 'Super Staff', role_home_path: '/Administrator/UserSetup' },
            { role_id: 3, role_title: 'Front Staff', role_home_path: '/Administrator/StudentRegistration' },
            { role_id: 4, role_title: 'Teacher', role_home_path: '/Administrator/Teacher' },
            { role_id: 5, role_title: 'Staff Lesson Management', role_home_path: '/Administrator/LessonSetup' },
            { role_id: 6, role_title: 'Student', role_home_path: '/' }
        ];
        
        return queryInterface.bulkInsert('rolemst', roles, { ignoreDuplicates: true });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('rolemst', null);
    }
};