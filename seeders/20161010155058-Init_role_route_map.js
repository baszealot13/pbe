'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        // Home: "front-end Lesson Group"
        var rrms = [
            { role_id: 1, route_id: 1 },
            { role_id: 1, route_id: 2 },
            { role_id: 1, route_id: 3 },
            { role_id: 1, route_id: 4 },
            { role_id: 1, route_id: 5 },
            { role_id: 1, route_id: 6 },
            { role_id: 1, route_id: 7 },
            { role_id: 1, route_id: 8 },
            { role_id: 1, route_id: 9 },
            { role_id: 1, route_id: 10 },
            { role_id: 1, route_id: 11 },
            { role_id: 1, route_id: 12 }
        ];

        return queryInterface.bulkInsert('role_route_map', rrms, { ignoreDuplicates: true });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('role_route_map', null);
    }
};