'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('routemst', {
            'route_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            'route_title': {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            'route_path': {
                type: Sequelize.STRING(250),
                allowNull: false,
                unique: true
            },
            'route_left': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: null
            },
            'route_right': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: null
            },
            'route_depth': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: null
            },
            'route_active': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            },
            'route_sys_add_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'route_sys_add_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'route_sys_last_mod_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'route_sys_last_mod_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'route_sys_delete_flag': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            }
        }, {
            engine: 'InnoDB',
            charset: 'utf8'
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('routemst');
    }
};