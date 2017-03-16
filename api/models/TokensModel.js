"use strict";
var extend = require('util')._extend,
    moment = require('moment');

var TokensModel = function (sequelize, DataTypes) {
    var definition = {'tkn_id': {type: DataTypes.INTEGER(10).UNSIGNED,primaryKey: true,autoIncrement: true},'usr_id': {type: DataTypes.INTEGER(10).UNSIGNED,allowNull: false},'action': {type: DataTypes.STRING(30)},'value': {type: DataTypes.STRING(40)},'tkn_expiry_date': {type: DataTypes.DATE,defaultValue: sequelize.fn('NOW')},'tkn_sys_add_date': {type: DataTypes.DATE,defaultValue: sequelize.fn('NOW')},'tkn_sys_last_mod_date': {type: DataTypes.DATE,defaultValue: sequelize.fn('NOW')}};

    var classMethods = {
        getDefinition: function () {
            return definition;
        }
    };

    var instanceMethods = {};

    var Tokens = sequelize.define('Tokens', definition, {
        timestamps: false,
        tableName: 'tokens',
        classMethods: classMethods,
        instanceMethods: instanceMethods
    });

    return Tokens;
};
module.exports = TokensModel;