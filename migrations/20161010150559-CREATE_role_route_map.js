'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('role_route_map', {
            'role_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                primaryKey: true
            },
            'route_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                primaryKey: true
            },
            'rrm_sys_last_mod_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'rrm_sys_last_mod_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'rrm_sys_delete_flag': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            }
        }, {
            engine: 'InnoDB',
            charset: 'utf8'
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('role_route_map');
    }
};