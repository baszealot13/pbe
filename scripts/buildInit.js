"use strict";

var Sequelize = require('sequelize'),
    Q = require('q'),
    dbConn = require(__dirname + '/../api/DatabaseConnection.js'),
    sequelize = dbConn.createSequelize('development', {logging: false}),
    User = dbConn.getModel(sequelize, 'User');

User.findAll().then(function(users) {
    return users.reduce(function (promise, user) {
        return promise.then(function () {
            
            var salt = User.randomSalt(),
                passwd = User.calculatePassword('password', salt);

            return User.update({ usr_passwd: passwd }, { where: { usr_id: user.dataValues.usr_id }});
        });
    }, Q()).then(function () {
        return sequelize.query('CALL rebuild_nested_set_routemst()').then(function () {
            sequelize.close();
            console.log('Init data complate');

            return null;
        });
    });

    return null;
});