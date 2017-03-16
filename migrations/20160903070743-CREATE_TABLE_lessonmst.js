'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('lessonmst', {
            'ls_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            'ls_title': {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            'ls_lsg_id': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false
            },
            'ls_description': {
                type: Sequelize.STRING(250)
            },
            'ls_midi_path': {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            'ls_mpeg_path': {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            'ls_ogg_path': {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            'ls_sort': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0
            },
            'ls_active': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            },
            'ls_sys_add_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'ls_sys_add_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'ls_sys_last_mod_user': {
                type: Sequelize.INTEGER(10).UNSIGNED,
                defaultValue: 0,
                allowNull: false
            },
            'ls_sys_last_mod_date': {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            'ls_sys_delete_flag': {
                type: Sequelize.BOOLEAN(1),
                defaultValue: 0
            }
        }, {
            engine: 'InnoDB',
            charset: 'utf8'
        }).then(function () {
            return queryInterface.addIndex('lessonmst', ['ls_lsg_id'], {
                indexName: 'ix_ls_lsg_id'
            });
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('lessonmst');
    }
};
