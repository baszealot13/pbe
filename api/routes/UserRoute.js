"use strict";

var moment = require('moment');

module.exports.setup = function (router) {
    try {
        router.route('/User')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    User = dbConn.getModel(req.user.sequelize, 'User'),
                    Role = dbConn.getModel(req.user.sequelize, 'Role');

                User.belongsTo(Role, { foreignKey: 'usr_role_id' });

                User.findAll({ 
                    include: [{
                        model: Role,
                        required: true,
                        attributes: ['role_title']
                    }],
                    where: { usr_sys_delete_flag: 0 }
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
                    User = dbConn.getModel(req.user.sequelize, 'User'),
                    data = User.parse(req.body);

                data.usr_passwd = User.calculatePassword(data.usr_passwd, User.randomSalt());
                data.usr_sys_add_user = req.user.usr_id;
                data.usr_sys_last_add_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                data.usr_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                
                User.create(data).then(function (rs) {
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
                    User = dbConn.getModel(req.user.sequelize, 'User'),
                    Role = dbConn.getModel(req.user.sequelize, 'Role'),
                    searches = User.parse(req.body),
                    conditions = {};

                for (var prop in searches) {
                    // console.log('prop: ', prop);
                    if (searches.hasOwnProperty(prop)) {
                        if (typeof searches[prop] === 'string') {
                            conditions[prop] = { $like: '%' + searches[prop] + '%' };
                        } else {
                            conditions[prop] = searches[prop];
                        }
                    }
                }

                conditions.usr_sys_delete_flag = 0;

                User.belongsTo(Role, { foreignKey: 'usr_role_id' });

                User.findAll({ 
                    include: [{
                        model: Role,
                        required: true,
                        attributes: ['role_title']
                    }],
                    where: conditions,
                    raw: true,
                    logging: false
                }).then(function (result) {
                    var stringify = JSON.stringify(result);
                    stringify = stringify.replace(/Role./g, '');
                    result = JSON.parse(stringify);

                    req.user.sequelize.close();
                    res.status(200);
                    res.json({
                        data: result
                    });
                    return null;
                }).catch(function (err) {
                    req.user.sequelize.close();
                    res.status(500);
                    console.log(err);
                });
            });
        router.route('/User/HomePage')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    User = dbConn.getModel(req.user.sequelize, 'User'),
                    Role = dbConn.getModel(req.user.sequelize, 'Role');

                User.belongsTo(Role, { foreignKey: 'usr_role_id' });

                User.find({ 
                    include: [{
                        model: Role,
                        required: true,
                        attributes: ['role_home_path']
                    }],
                    where: { usr_id: req.user.usr_id },
                    logging: false
                }).then(function (rs) {
                    if (!rs) {
                        res.status(400).json();
                    } else {
                        res.status(200).json(rs);
                    }
                    return null;
                }).catch(function (e) {
                    console.log(e);
                    res.status(500).json();
                });

            });
        router.route('/User/:usr_id')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    User = dbConn.getModel(req.user.sequelize, 'User');

                var usr_id = req.params.usr_id;

                User.find({ where: { usr_id: usr_id }}).then(function (data) {
                    req.user.sequelize.close();
                    res.status(200);
                    res.json(data);

                    return null;
                });
            })
            .put(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    User = dbConn.getModel(req.user.sequelize, 'User'),
                    data = User.parse(req.body);

                data.usr_sys_last_mod_user = req.user.usr_id;
                data.usr_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                delete data.usr_passwd;
                
                User.update(data, { where: { usr_id: req.params.usr_id } }).then(function (rs) {
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
                    User = dbConn.getModel(req.user.sequelize, 'User'),
                    data = {
                        usr_sys_last_mod_user: req.user.usr_id,
                        usr_sys_last_mod_date: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                        usr_sys_delete_flag: 1
                    };
                
                User.update(data, { where: { usr_id: req.params.usr_id } }).then(function (rs) {
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
        router.route('/MyProfile')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    User = dbConn.getModel(req.user.sequelize, 'User');

                console.log('==========my profile==========');
                User.findOne({ 
                    attributes: ['usr_title', 'usr_email'],
                    where: { usr_id: req.user.usr_id }, 
                    logging: true,
                    raw: true 
                }).then(function (user) {
                    req.user.sequelize.close();
                    if (user) {
                        res.status(200);
                        res.json(user);
                    } else {
                        res.status(404);
                        res.json();
                    }
                });
            });
        router.route('/MyProfile/ChangePassword')
            .put(function (req, res) {
                console.log('==========my profile *****==========');
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    User = dbConn.getModel(req.user.sequelize, 'User'),
                    curPasswd = req.body.curPassword,
                    newPassword = req.body.newPassword,
                    confPassword = req.body.confPassword;

                if (!curPasswd || !newPassword || !confPassword) {
                    res.status(400).json({
                        statusText: 'Invalid Data.',
                        status: 400
                    });
                } else if (newPassword !== confPassword) {
                    res.status(400).json({
                        statusText: 'New Password or Confirm Password Incorrect.',
                        status: 400
                    })
                } else {
                    User.findOne({ 
                        where: { usr_id: req.user.usr_id }
                    }).then(function (user) {
                        if (user.checkPassword(curPasswd)) {
                            var salt = User.randomSalt(),
                                passwd = User.calculatePassword(newPassword, salt);

                            User.update({
                                usr_passwd: passwd
                            }, {
                                where: {
                                    usr_id: user.usr_id
                                }
                            }).then(function () {
                                req.user.sequelize.close();
                                res.status(200).json();
                            });

                        } else {
                            req.user.sequelize.close();
                            res.status(404);
                            res.json({
                                statusText: 'Current Password Incorrect.',
                                status: 404
                            });
                        }
                    });
                }
                
            });
    } catch (e) {
        console.log(e, __filename);
    }
};