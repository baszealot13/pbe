'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('lessongroupmst', {
            'lsg_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            'lsg_title': {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            'lsg_description': {
                type: Sequelize.STRING(250)
            },
            'lsg_sort': {
                type: Sequelize.INTEGER(10).UNSIGNED,
            },
            'lsg_active': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            },
            'lsg_sys_add_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'lsg_sys_add_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'lsg_sys_last_mod_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'lsg_sys_last_mod_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'lsg_sys_delete_flag': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            }
        }, {
            engine: 'InnoDB',
            charset: 'utf8'
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('lessongroupmst');
    }
};
