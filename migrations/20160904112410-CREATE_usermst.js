'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('usermst', {
            'usr_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            'usr_title': {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true
            },
            'usr_passwd': {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            'usr_email': {
                type: Sequelize.STRING(100)
            },
            'usr_role_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                defaultValue: 3
            },
            'usr_student_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: null
            },
            'usr_active': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            },
            'usr_sys_add_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'usr_sys_add_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'usr_sys_last_mod_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'usr_sys_last_mod_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'usr_sys_delete_flag': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            }
        }, {
            engine: 'InnoDB',
            charset: 'utf8'
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('usermst');
    }
};