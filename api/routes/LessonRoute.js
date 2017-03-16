"use strict";

module.exports.setup = function (router) {
    var fs = require('fs'),
        path = require('path'),
        mkdirp = require('mkdirp'),
        multiparty = require('multiparty'),
        randomString = require('randomstring'),
        moment = require('moment');

    try {
        router.route('/Lesson')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    Lesson = dbConn.getModel(req.user.sequelize, 'Lesson'),
                    LessonGroup = dbConn.getModel(req.user.sequelize, 'LessonGroup');

                Lesson.belongsTo(LessonGroup, { foreignKey: 'ls_lsg_id' });

                Lesson.findAll({ 
                    include: [{
                        model: LessonGroup,
                        required: true,
                        attributes: ['lsg_title']
                    }],
                    where: { ls_sys_delete_flag: 0 }
                }).then(function (result) {
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
            })
            .put(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    Lesson = dbConn.getModel(req.user.sequelize, 'Lesson'),
                    config = require(__dirname + '/../../config/config.json')[process.env.NODE_ENV],
                    form = new multiparty.Form();

                form.parse(req, function (err, fields, files) {
                    if (err) {
                        res.status(500).json({
                            result: false
                        });
                    } else {

                        var lessons = fields,
                            lsMidFiles = files.ls_midi_path[0],
                            lsMpegFiles = files.ls_mpeg_path[0],
                            midFileType = lsMidFiles.originalFilename.split('.').pop(),
                            mpegFileType = lsMpegFiles.originalFilename.split('.').pop(),
                            pathMid = config.pbe_config.path + '/media/midi/',
                            pathMpeg = config.pbe_config.path + '/media/mpeg/',
                            newFileName = moment().format('MMM_YYYY_') + randomString.generate(20) + '.';

                        fs.writeFileSync(pathMid + newFileName + midFileType, lsMidFiles.path);
                        fs.writeFileSync(pathMpeg + newFileName + mpegFileType, lsMpegFiles.path);

                        for (var ls in lessons) {
                            lessons[ls] = lessons[ls][0];
                        }

                        lessons.ls_midi_path = pathMid + newFileName + midFileType;
                        lessons.ls_mpeg_path = pathMpeg + newFileName + mpegFileType;
                        lessons.ls_sys_add_user = req.user.usr_id;
                        lessons.ls_sys_last_add_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                        lessons.ls_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');

                        Lesson.create(lessons).then(function (rs) {
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
                            res.status(500);
                            console.log(err);

                            return null;
                        });
                    }
                });
            })
            .post(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    Lesson = dbConn.getModel(req.user.sequelize, 'Lesson'),
                    LessonGroup = dbConn.getModel(req.user.sequelize, 'LessonGroup'),
                    searches = Lesson.parse(req.body),
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

                conditions.ls_sys_delete_flag = 0;

                Lesson.belongsTo(LessonGroup, { foreignKey: 'ls_lsg_id' });

                Lesson.findAll({ 
                    include: [{
                        model: LessonGroup,
                        required: true,
                        attributes: ['lsg_title']
                    }],
                    where: conditions,
                    raw: true,
                    logging: false
                }).then(function (result) {
                    var stringify = JSON.stringify(result);
                    stringify = stringify.replace(/LessonGroup./g, '');
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
        router.route('/Lesson/:ls_id')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    Lesson = dbConn.getModel(req.user.sequelize, 'Lesson'),
                    ls_id = req.params.ls_id,
                    fs = require('fs'),
                    result = {};


                Lesson.findOne({ where: { ls_id: ls_id }}).then(function (lesson) {

                    req.user.sequelize.close(); 

                    res.status(200);
                    res.json(lesson);

                    return null;
                }).catch(function (err) {
                    req.user.sequelize.close();
                    console.log(err);

                    return null;
                });
            })
            .delete(function(req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    Lesson = dbConn.getModel(req.user.sequelize, 'Lesson'),
                    data = {
                        ls_sys_last_mod_user: 1,
                        ls_sys_last_mod_date: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
                        ls_sys_delete_flag: 1
                    };
                
                Lesson.update(data, { where: { ls_id: req.params.ls_id }, logging: true }).then(function (rs) {
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
        router.route('/Lesson/Update')
            .put(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    Lesson = dbConn.getModel(req.user.sequelize, 'Lesson'),
                    config = require(__dirname + '/../../config/config.json')[process.env.NODE_ENV],
                    form = new multiparty.Form();

                form.parse(req, function (err, fields, files) {
                    if (err) {
                        res.status(err.statusCode).json({
                            result: false
                        });
                    } else {
                        var lessons = fields, 
                            lsMidFiles = null,
                            lsMpegFiles = null,
                            midFileType = null,
                            mpegFileType = null,
                            pathMid = null,
                            pathMpeg = null,
                            newFileName = moment().format('MMM_YYYY_') + randomString.generate(20) + '.';

                        for (var ls in lessons) {
                            lessons[ls] = lessons[ls][0];
                        }

                        if (typeof fields.ls_midi_path === 'undefined') {
                            lsMidFiles = files.ls_midi_path[0];
                            midFileType = lsMidFiles.originalFilename.split('.').pop();
                            pathMid = config.pbe_config.path + '/media/midi/';
                            // fs.writeFileSync(pathMid + newFileName + midFileType, lsMidFiles.path);
                            // fs.writeFileSync(fs.createWriteStream(pathMid + newFileName + midFileType), lsMidFiles.path);
                            fs.writeFileSync(pathMid + newFileName + midFileType, fs.readFileSync(lsMidFiles.path));
                            lessons.ls_midi_path = pathMid + newFileName + midFileType;
                        }

                        if (typeof fields.ls_mpeg_path === 'undefined') {
                            lsMpegFiles = files.ls_mpeg_path[0];
                            mpegFileType = lsMpegFiles.originalFilename.split('.').pop();
                            pathMpeg = config.pbe_config.path + '/media/mpeg/';
                            // fs.writeFileSync(pathMpeg + newFileName + mpegFileType, lsMpegFiles.path);
                            // fs.writeFileSync(fs.createWriteStream(pathMpeg + newFileName + mpegFileType), lsMpegFiles.path);
                            fs.writeFileSync(pathMpeg + newFileName + mpegFileType, fs.readFileSync(lsMpegFiles.path));
                            lessons.ls_mpeg_path = pathMpeg + newFileName + mpegFileType;
                        }

                        

                        lessons.ls_sys_last_mod_user = req.user.usr_id;
                        lessons.ls_sys_last_mod_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');

                        Lesson.upsert(lessons).then(function (rs) {
                            req.user.sequelize.close();

                            res.status(200).json(rs);

                            return null;
                        }).catch(function (err) {
                            req.user.sequelize.close();
                            res.status(500);
                            console.log(err);

                            return null;
                        });
                    }
                });
            });
        router.route('/Lesson/Practice/:ls_id')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize('development', { logging: false }),
                    Lesson = dbConn.getModel(req.user.sequelize, 'Lesson'),
                    ls_id = req.params.ls_id,
                    fs = require('fs'),
                    result = {};


                Lesson.findOne({ where: { ls_id: ls_id }}).then(function (lesson) {
                    req.user.sequelize.close(); 

                    for(var ls in lesson.dataValues) {
                        if (lesson.dataValues.hasOwnProperty(ls)) {
                            if ((ls === 'ls_midi_path' && lesson.dataValues[ls] !== null) ||
                                    (ls === 'ls_mpeg_path' && lesson.dataValues[ls] !== null)) {

                                result[ls] = fs.readFileSync(lesson.dataValues[ls].toString());
                            } else {
                                result[ls] = lesson.dataValues[ls];
                            }
                        }
                    }

                    req.user.sequelize.close();
                    res.status(200);
                    res.json(result);
                });
            });
        router.route('/Lesson/ByGroup/:ls_lsg_id')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize('development', { logging: false }),
                    Lesson = dbConn.getModel(sequelize, 'Lesson'), 
                    ls_lsg_id = req.params.ls_lsg_id;

                Lesson.findAll({ where: { ls_lsg_id: ls_lsg_id }}).then(function (result) {
                    sequelize.close();
                    res.status(200);
                    res.json({
                        data: result
                    });
                });
            })
    } catch (e) {
        console.log(e, __filename);
    }
};