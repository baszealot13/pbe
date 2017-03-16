"use strict";
var extend = require('util')._extend,
    moment = require('moment');

var RouteModel = function (sequelize, DataTypes) {
    var definition = {'route_id': {type: DataTypes.INTEGER(10).UNSIGNED,primaryKey: true,autoIncrement: true},'route_title': {type: DataTypes.STRING(45),allowNull: false},'route_path': {type: DataTypes.STRING(250),allowNull: false,unique: true},'route_left': {type: DataTypes.INTEGER(10).UNSIGNED,defaultValue: null},'route_right': {type: DataTypes.INTEGER(10).UNSIGNED,defaultValue: null},'route_depth': {type: DataTypes.INTEGER(10).UNSIGNED,defaultValue: null},'route_active': {type: DataTypes.BOOLEAN(1),defaultValue: 0},'route_sys_add_user': {type: DataTypes.INTEGER(10).UNSIGNED,defaultValue: 0,allowNull: false},'route_sys_add_date': {type: DataTypes.DATE,defaultValue: sequelize.fn('NOW'),allowNull: false},'route_sys_last_mod_user': {type: DataTypes.INTEGER(10).UNSIGNED,defaultValue: 0,allowNull: false},'route_sys_last_mod_date': {type: DataTypes.DATE,defaultValue: sequelize.fn('NOW'),allowNull: false},'route_sys_delete_flag': {type: DataTypes.BOOLEAN(1),defaultValue: 0}};


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

    var Route = sequelize.define('Route', definition, {
        timestamps: false,
        tableName: 'routemst',
        classMethods: classMethods,
        instanceMethods: instanceMethods
    });

    return Route;
};
module.exports = RouteModel;