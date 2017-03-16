'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('tokens', {
            'tkn_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            'usr_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false
            },
            'action': {
                type: Sequelize.STRING(30)
            },
            'value': {
                type: Sequelize.STRING(40)
            },
            'tkn_expiry_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            'tkn_sys_add_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            'tkn_sys_last_mod_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        }, {
            engine: 'InnoDB',
            charset: 'utf8'
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('tokens');
    }
};