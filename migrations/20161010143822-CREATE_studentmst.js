'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('studentmst', {
            'std_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            'std_firstname': {
                type: Sequelize.STRING(250),
                allowNull: false
            },
            'std_lastname': {
                type: Sequelize.STRING(250),
                allowNull: false
            },
            'std_nickname': {
                type: Sequelize.STRING(250),
                defaultValue: null
            },
            'std_birthday': {
                type: Sequelize.DATEONLY,
                defaultValue: null
            },
            'std_email': {
                type: Sequelize.STRING(250),
                defaultValue: null
            },
            'std_phonenumber1': {
                type: Sequelize.STRING(20),
                defaultValue: null
            },
            'std_phonenumber2': {
                type: Sequelize.STRING(20),
                defaultValue: null
            },
            'std_address': {
                type: Sequelize.STRING(250),
                defaultValue: null
            },
            'std_active': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            },
            'std_sys_add_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'std_sys_add_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'std_sys_last_mod_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'std_sys_last_mod_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'std_sys_delete_flag': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            }
        }, {
            engine: 'InnoDB',
            charset: 'utf8'
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('studentmst');
    }
};