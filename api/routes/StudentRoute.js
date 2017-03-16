"use strict";

var moment = require('moment'),
    randomString = require('randomstring'),
    Helper = require(__dirname + '/../models/ext/HelperModel.js');;

module.exports.setup = function (router) {
    try {
        router.route('/Student')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    Student = dbConn.getModel(req.user.sequelize, 'Student');

                Student.findAll({ 
                    where: { std_sys_delete_flag: 0 }
                }).then(function (result) {
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
                    Student = dbConn.getModel(req.user.sequelize, 'Student'),
                    User = dbConn.getModel(req.user.sequelize, 'User'),
                    data = Student.parse(req.body);

                data.stu_sys_add_user = req.user.usr_id;
                data.stu_sys_last_add_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                data.stu_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');

                var username = data.std_username;
                delete data.std_username;
                
                req.user.sequelize.transaction({ autocommit: false }).then(function (t) {
                    return Student.create(data, { transaction: t }).then(function (rsStudent) {
                        return rsStudent;
                    }).then(function (rsStudent) {
                        var passwd = randomString.generate(6),
                            usrPasswd = User.calculatePassword(passwd, User.randomSalt());

                        return User.create({
                            usr_title: username,
                            usr_passwd: usrPasswd,
                            usr_email: rsStudent.dataValues.std_email,
                            usr_role_id: 3,
                            usr_student_id: rsStudent.dataValues.std_id,
                            usr_active: rsStudent.dataValues.std_active,
                            usr_sys_add_user: rsStudent.dataValues.std_sys_add_user,
                            usr_sys_add_date: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                            usr_sys_last_mod_user: req.user.usr_id
                        }, {
                            transaction: t
                        }).then(function (user) {
                            return { userTitle: user.usr_title, userPasswd: passwd } || null;
                        });
                    }).then(function (result) {
                        req.user.sequelize.close();
                        return t.commit().then(function () {
                            req.user.sequelize.close();
                            if (result) {
                                res.status(201);
                            } else {
                                res.status(404);
                            }

                            res.json(result);
                            return null;
                        });
                    }, function (e) {
                        return t.rollback().then(function () {
                            console.log('transaction.catch: ', e);
                            req.user.sequelize.close();
                            res.status(400).json(Helper.getErrorMessageObject(e));
                            return null;
                        });
                    });

                    return null;
                }).catch(function (err) {
                    req.user.sequelize.close();
                    console.log(err);
                });
            });
        router.route('/Student/:std_id')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    Student = dbConn.getModel(req.user.sequelize, 'Student');

                var std_id = req.params.std_id;

                Student.find({ where: { std_id: std_id }}).then(function (data) {
                    req.user.sequelize.close();
                    res.status(200);
                    res.json(data);

                    return null;
                });
            })
            .put(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    Student = dbConn.getModel(req.user.sequelize, 'Student'),
                    data = Student.parse(req.body);

                data.std_sys_last_mod_user = 1;
                data.std_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                
                Student.update(data, { where: { std_id: req.params.std_id } }).then(function (rs) {
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
                    Student = dbConn.getModel(req.user.sequelize, 'Student'),
                    data = {
                        std_sys_last_mod_user: 1,
                        std_sys_last_mod_date: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                        std_sys_delete_flag: 1
                    };
                
                Student.update(data, { where: { std_id: req.params.std_id } }).then(function (rs) {
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