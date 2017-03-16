"use strict";
var extend = require('util')._extend,
    moment = require('moment');

var RoleRouteMapModel = function (sequelize, DataTypes) {
    var definition = {'role_id': {type: DataTypes.INTEGER(10).UNSIGNED,primaryKey: true},'route_id': {type: DataTypes.INTEGER(10).UNSIGNED,primaryKey: true},'rrm_sys_last_mod_user': {type: DataTypes.INTEGER(10).UNSIGNED,defaultValue: 0,allowNull: false},'rrm_sys_last_mod_date': {type: DataTypes.DATE,defaultValue: sequelize.fn('NOW'),allowNull: false},'rrm_sys_delete_flag': {type: DataTypes.BOOLEAN(1),defaultValue: 0}};

    var classMethods = {
        getDefinition: function () {
            return definition;
        }
    };
    var instanceMethods = {};

    try {
        var ExtUserModel = require(__dirname + '/ext/ExtUserModel.js');

        if (ExtUserModel.classMethods !== undefined) {
            classMethods = extend(ExtUserModel.classMethods, classMethods);
        }
        if (ExtUserModel.instanceMethods !== undefined) {
            instanceMethods = extend(ExtUserModel.instanceMethods, instanceMethods);
        }
    } catch (err) { }

    var RoleRouteMap = sequelize.define('RoleRouteMap', definition, {
        timestamps: false,
        tableName: 'role_route_map',
        classMethods: classMethods,
        instanceMethods: instanceMethods
    });

    return RoleRouteMap;
};
module.exports = RoleRouteMapModel;