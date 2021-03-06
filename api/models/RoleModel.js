"use strict";
var extend = require('util')._extend,
    moment = require('moment');

var RoleModel = function (sequelize, DataTypes) {
    var definition = {'role_id': {type: DataTypes.INTEGER(10).UNSIGNED,primaryKey: true,autoIncrement: true},'role_title': {type: DataTypes.STRING(45),allowNull: false,unique: true},'role_desciption': {type: DataTypes.STRING(100),defaultValue: null},'role_home_path': {type: DataTypes.STRING(250),allowNull: false},'role_active': {type: DataTypes.BOOLEAN(1),defaultValue: 0},'role_sys_add_user': {type: DataTypes.INTEGER(10).UNSIGNED,defaultValue: 0,allowNull: false},'role_sys_add_date': {type: DataTypes.DATE,defaultValue: sequelize.fn('NOW'),allowNull: false},'role_sys_last_mod_user': {type: DataTypes.INTEGER(10).UNSIGNED,defaultValue: 0,allowNull: false},'role_sys_last_mod_date': {type: DataTypes.DATE,defaultValue: sequelize.fn('NOW'),allowNull: false},'role_sys_delete_flag': {type: DataTypes.BOOLEAN(1),defaultValue: 0}};

    var classMethods = {
        getDefinition: function () {
            return definition;
        },
        parse: function (obj) {
            if (Array.isArray(obj)) {
                obj.forEach(function (row, i) {
                    row = this._parseRow(row);
                });
            } else {
                obj = this._parseRow(obj);
            }
            return obj;
        },
        _parseRow: function (row) {
            for (var col in row) {
                if (/INT/g.test(definition[col].type)) {
                    if (row[col] === true) {
                        row[col] = 1;
                    } else if (row[col] === false) {
                        row[col] = 0;
                    } else {
                        if (row[col] !== null) {
                            if (parseInt(row[col])) {
                                row[col] = parseInt(row[col]);
                            } else {
                                row[col] = 0;
                            }
                        }
                    }
                } else if (/FLOAT/g.test(definition[col].type) || /DOUBLE/g.test(definition[col].type) || /DECIMAL/g.test(definition[col].type)) {
                    if (row[col] !== null) {
                        row[col] = parseFloat(row[col]);
                    }
                } else if (/TIMESTAMP/g.test(definition[col].type) || /DATETIME/g.test(definition[col].type)) {
                    // Convert ISO 8601 string to UTC string
                    if (typeof row[col] == 'string') {
                        if(row[col].match(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/)) {
                            row[col] = moment.utc(row[col]).format('YYYY-MM-DD HH:mm:ss');
                        }
                    }
                } else if (/DATE/g.test(definition[col].type)) {
                    // Convert ISO 8601 string to DATE format
                    if (typeof row[col] == 'string') {
                        if(row[col].match(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/)) {
                            row[col] = moment.utc(row[col]).format('YYYY-MM-DD');
                        }
                    }
                }
            }
            return row;
        }
    };
    var instanceMethods = {};

    try {
        var ExtRoleModel = require(__dirname + '/ext/ExtRoleModel.js');

        if (ExtRoleModel.classMethods !== undefined) {
            classMethods = extend(ExtRoleModel.classMethods, classMethods);
        }
        if (ExtRoleModel.instanceMethods !== undefined) {
            instanceMethods = extend(ExtRoleModel.instanceMethods, instanceMethods);
        }
    } catch (err) { }

    var Role = sequelize.define('Role', definition, {
        timestamps: false,
        tableName: 'rolemst',
        classMethods: classMethods,
        instanceMethods: instanceMethods
    });

    return Role;
};
module.exports = RoleModel;