"use strict";

var moment = require('moment');

module.exports.setup = function (router) {
    try {
        router.route('/Route')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    Route = dbConn.getModel(sequelize, 'Route');

                Route.findAll({ where: { route_sys_delete_flag: 0 } }).then(function (result) {
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
                    Route = dbConn.getModel(sequelize, 'Route'),
                    data = Route.parse(req.body);

                data.route_sys_add_user = 1;
                data.route_sys_last_add_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                data.route_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                
                Route.create(data).then(function (rs) {
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
        router.route('/Route/:route_id')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    Route = dbConn.getModel(sequelize, 'Route');

                var route_id = req.params.route_id;

                Route.find({ where: { route_id: route_id }}).then(function (data) {
                    sequelize.close();
                    res.status(200);
                    res.json(data);

                    return null;
                });
            })
            .put(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    Route = dbConn.getModel(sequelize, 'Route'),
                    data = Route.parse(req.body);

                data.route_sys_last_mod_user = 1;
                data.route_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                
                Route.update(data, { where: { route_id: req.params.route_id } }).then(function (rs) {
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
                    Route = dbConn.getModel(sequelize, 'Route'),
                    data = {
                        route_sys_last_mod_user: 1,
                        route_sys_last_mod_date: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                        route_sys_delete_flag: 1
                    };
                
                Route.update(data, { where: { route_id: req.params.route_id } }).then(function (rs) {
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