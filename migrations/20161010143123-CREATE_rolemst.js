'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('rolemst', {
            'role_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            'role_title': {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true
            },
            'role_desciption': {
                type: Sequelize.STRING(100),
                defaultValue: null
            },
            'role_home_path': {
                type: Sequelize.STRING(250),
                allowNull: false
            },
            'role_active': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            },
            'role_sys_add_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'role_sys_add_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'role_sys_last_mod_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'role_sys_last_mod_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'role_sys_delete_flag': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            }
        }, {
            engine: 'InnoDB',
            charset: 'utf8'
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('rolemst');
    }
};