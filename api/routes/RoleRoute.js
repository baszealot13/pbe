"use strict";

var moment = require('moment');

module.exports.setup = function (router) {
    try {
        router.route('/Role')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    Role = dbConn.getModel(sequelize, 'Role');

                Role.findAll({ where: { role_sys_delete_flag: 0 } }).then(function (result) {
                    sequelize.close();
                    res.status(200);
                    res.json({
                        data: result
                    });

                    return null;
                });
            })
            .put(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    Role = dbConn.getModel(sequelize, 'Role'),
                    data = Role.parse(req.body);

                data.role_sys_add_user = 1;
                data.role_sys_last_add_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                data.role_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                
                Role.create(data).then(function (rs) {
                    sequelize.close();
                    if (rs) {
                        res.status(201);
                    } else {
                        res.status(404);
                    }

                    res.json(rs);

                    return null;
                }).catch(function (err) {
                    sequelize.close();
                    console.log(err);
                });
            });
        router.route('/Role/:role_id')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    Role = dbConn.getModel(sequelize, 'Role');

                var role_id = req.params.role_id;

                Role.find({ where: { role_id: role_id }}).then(function (data) {
                    sequelize.close();
                    res.status(200);
                    res.json(data);

                    return null;
                });
            })
            .put(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    Role = dbConn.getModel(sequelize, 'Role'),
                    data = Role.parse(req.body);

                data.role_sys_last_mod_user = 1;
                data.role_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                
                Role.update(data, { where: { role_id: req.params.role_id } }).then(function (rs) {
                    sequelize.close();

                    if (rs[0] === 1) {
                        res.status(200);
                    } else {
                        res.status(404);
                    }

                    res.json({
                        result: true
                    });

                    return null;
                }).catch(function (err) {
                    sequelize.close();
                    console.log(err);
                });
            })
            .delete(function(req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    Role = dbConn.getModel(sequelize, 'Role'),
                    data = {
                        role_sys_last_mod_user: 1,
                        role_sys_last_mod_date: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                        role_sys_delete_flag: 1
                    };
                
                Role.update(data, { where: { role_id: req.params.role_id } }).then(function (rs) {
                    sequelize.close();

                    if (rs[0] === 1) {
                        res.status(200);
                    } else {
                        res.status(404);
                    }

                    res.json({
                        result: true
                    });

                    return null;
                }).catch(function (err) {
                    sequelize.close();
                    console.log(err);
                });
            });
    } catch (e) {
        console.log(e, __filename);
    }
};