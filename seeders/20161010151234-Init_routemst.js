'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        // Home: "front-end Lesson Group"
        var routes = [
            { route_id: 1, route_title: 'Home', route_path: '/', route_active: 1 },
            { route_id: 2, route_title: 'Administrator', route_path: '/Administrator', route_active: 1 },
            { route_id: 3, route_title: 'User Setup', route_path: '/Administrator/UserSetup', route_active: 1 },
            { route_id: 4, route_title: 'Authorization', route_path: '/Administrator/UserSetup/Authorization', route_active: 1 },
            { route_id: 5, route_title: 'Roles', route_path: '/Administrator/UserSetup/Authorization/Role', route_active: 1 },
            { route_id: 6, route_title: 'Role Authorization', route_path: '/Administrator/UserSetup/Authorization/RoleAuthorization', route_active: 1 },
            { route_id: 7, route_title: 'Users', route_path: '/Administrator/UserSetup/User', route_active: 1 },
            { route_id: 8, route_title: 'Lesson Setup', route_path: '/Administrator/LessonSetup', route_active: 1 },
            { route_id: 9, route_title: 'Lesson Group', route_path: '/Administrator/LessonSetup/LessonGroup', route_active: 1 },
            { route_id: 10, route_title: 'Lesson', route_path: '/Administrator/LessonSetup/Lesson', route_active: 1 },
            { route_id: 11, route_title: 'Student Registration', route_path: '/Administrator/StudentRegistration', route_active: 1 },
            { route_id: 12, route_title: 'Teacher', route_path: '/Administrator/Teacher', route_active: 1 },
            { route_id: 13, route_title: 'Student Histories', route_path: '/Administrator/Teacher/StudentHistories', route_active: 1 },
            { route_id: 14, route_title: 'Lesson List', route_path: '/LessonList', route_active: 1 },
            { route_id: 15, route_title: 'Lesson', route_path: '/Lesson', route_active: 1 }
        ];

        return queryInterface.bulkInsert('routemst', routes, { ignoreDuplicates: true });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('routemst', null);
    }
};