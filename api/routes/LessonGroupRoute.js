"use strict";

var moment = require('moment');

module.exports.setup = function (router) {
    try {
        router.route('/LessonGroup')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    LessonGroup = dbConn.getModel(req.user.sequelize, 'LessonGroup');

                LessonGroup.findAll({ where: { lsg_sys_delete_flag: 0 }, logging: false }).then(function (result) {
                    req.user.sequelize.close();
                    res.status(200);
                    res.json({
                        data: result
                    });

                    return null;
                });
            })
            .put(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    LessonGroup = dbConn.getModel(req.user.sequelize, 'LessonGroup'),
                    data = LessonGroup.parse(req.body);

                data.lsg_sys_add_user = 1;
                data.lsg_sys_last_add_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                data.lsg_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                
                LessonGroup.create(data).then(function (rs) {
                    req.user.sequelize.close();
                    if (rs) {
                        res.status(201);
                    } else {
                        res.status(404);
                    }

                    res.json(rs);

                    return null;
                }).catch(function (err) {
                    req.user.sequelize.close();
                    console.log(err);
                });
            })
            .post(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    LessonGroup = dbConn.getModel(req.user.sequelize, 'LessonGroup'),
                    searches = LessonGroup.parse(req.body),
                    conditions = {};

                for (var prop in searches) {
                    console.log('prop: ', prop);
                    if (searches.hasOwnProperty(prop)) {
                        if (typeof searches[prop] === 'string') {
                            conditions[prop] = { $like: '%' + searches[prop] + '%' };
                        } else {
                            conditions[prop] = searches[prop];
                        }
                    }
                }
                   
                conditions.lsg_sys_delete_flag = 0;

                LessonGroup.findAll({ where: conditions, logging: false, raw: false }).then(function (result) {
                    req.user.sequelize.close();
                    res.status(200);
                    res.json({
                        data: result
                    });

                    return null;
                });
            });
        router.route('/LessonGroup/:lsg_id')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    LessonGroup = dbConn.getModel(req.user.sequelize, 'LessonGroup');

                var lsg_id = req.params.lsg_id;

                LessonGroup.find({ where: { lsg_id: lsg_id }}).then(function (data) {
                    req.user.sequelize.close();
                    res.status(200);
                    res.json(data);

                    return null;
                });
            })
            .put(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    LessonGroup = dbConn.getModel(req.user.sequelize, 'LessonGroup'),
                    data = LessonGroup.parse(req.body);

                data.lsg_sys_last_mod_user = 1;
                data.lsg_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                
                LessonGroup.update(data, { where: { lsg_id: req.params.lsg_id } }).then(function (rs) {
                    req.user.sequelize.close();

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
                    req.user.sequelize.close();
                    console.log(err);
                });
            })
            .delete(function(req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    LessonGroup = dbConn.getModel(req.user.sequelize, 'LessonGroup'),
                    data = {
                        lsg_sys_last_mod_user: 1,
                        lsg_sys_last_mod_date: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                        lsg_sys_delete_flag: 1
                    };
                
                LessonGroup.update(data, { where: { lsg_id: req.params.lsg_id } }).then(function (rs) {
                    req.user.sequelize.close();

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
                    req.user.sequelize.close();
                    console.log(err);
                });
            });
    } catch (e) {
        console.log(e, __filename);
    }
};