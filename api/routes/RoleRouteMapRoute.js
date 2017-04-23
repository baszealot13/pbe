"use strict";

module.exports.setup = function (router) {
    try {
        router.route('/Role/Access/Route/:route_path')
            .get(function(req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    RoleRouteMap = dbConn.getModel(sequelize, 'RoleRouteMap'),
                    Route = dbConn.getModel(sequelize, 'Route'),
                    User =  dbConn.getModel(sequelize, 'User'),
                    route_path = req.params.route_path;

                
                RoleRouteMap.belongsTo(Route, { foreignKey: 'route_id' });

                User.findOne({ where: { usr_id: 1 }}).then(function (user) {
                   RoleRouteMap.findAll({
                        include: [{ 
                            model: Route, 
                            required: true, 
                            attributes: ['route_id', 'route_title', 'route_path', 'route_left', 'route_right', 'route_depth'], 
                            where: { route_path: route_path, route_active: 1 }}],
                        where: { role_id: user.usr_role_id },
                        logging: false
                    }).then(function (data) {
                        sequelize.close();
                        if (!data) {
                            res.status(404);
                        } else {
                            res.status(200);
                        }

                        res.json({ 
                            data: data 
                        });
                        return null;
                    });

                    return null;
                }).catch(function (err) {
                    sequelize.close();
                    res.status(400);
                    console.log(err);
                });
            });
        router.route('/RoleRouteMap/Admin/Menu')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    RoleRouteMap = dbConn.getModel(sequelize, 'RoleRouteMap'),
                    Route = dbConn.getModel(sequelize, 'Route'),
                    User =  dbConn.getModel(sequelize, 'User');

                RoleRouteMap.belongsTo(Route, { foreignKey: 'route_id' }); 

                User.findOne({ where: { usr_id: 1}}).then(function (user) {
                    RoleRouteMap.findAll({ 
                        include: [{
                            model: Route,
                            required: true,
                            where: { route_path: { $like: '%/Administrator%' }, route_active: 1 },
                            attributes: ['route_title', 'route_path', 'route_left', 'route_right', 'route_depth']
                        }],
                        where: {
                            role_id: user.usr_role_id
                        },
                        attributes: Object.keys(RoleRouteMap.attributes).concat([
                            [ sequelize.literal('IFNULL((SELECT `route_parent`.`route_id` FROM `routemst` AS `route_parent` WHERE (`route_parent`.`route_left` < `Route`.`route_left` AND `route_parent`.`route_right` > `Route`.`route_right`) AND route_active = 1 ORDER BY `route_parent`.`route_depth` DESC LIMIT 1), 0)'), 'route_parent' ],
                            [ sequelize.literal('(SELECT COUNT(*) FROM `routemst` AS `subRoute` WHERE (`subRoute`.`route_left` > `Route`.`route_left` AND `subRoute`.`route_right` < `Route`.`route_right`) AND route_active = 1)'), 'subMenu' ]
                        ])
                    }).then(function (rs) {
                        sequelize.close();
                        res.status(200).json({ 
                            data: rs
                        });
                    });

                    return null;
                }).catch(function (err) {
                    sequelize.close();
                    res.status(400);
                    console.log(err);
                });
            });
        router.route('/RoleRouteMap/Admin/Menu/:route_left/:route_right/:route_depth')
            .get(function (req, res) {
                var dbConn = require(__dirname + '/../DatabaseConnection.js'),
                    sequelize = dbConn.createSequelize(req.user.sequelize, { logging: false }),
                    RoleRouteMap = dbConn.getModel(sequelize, 'RoleRouteMap'),
                    Route = dbConn.getModel(sequelize, 'Route'),
                    User =  dbConn.getModel(sequelize, 'User'),
                    route_left = parseInt(req.params.route_left),
                    route_right = parseInt(req.params.route_right),
                    route_depth = parseInt(req.params.route_depth);

                RoleRouteMap.belongsTo(Route, { foreignKey: 'route_id' }); 

                User.findOne({ where: { usr_id: 1}}).then(function (user) {
                    RoleRouteMap.findAll({ 
                        include: [{
                            model: Route,
                            required: true,
                            where: { 
                                $and: {
                                    route_left: {
                                        $gt: route_left
                                    },
                                    route_right: {
                                        $lt: route_right
                                    }
                                },
                                route_depth: route_depth + 1,
                                route_path: { $like: '%/Administrator%' }, 
                                route_active: 1 
                            },
                            attributes: ['route_title', 'route_path', 'route_left', 'route_right', 'route_depth']
                        }],
                        where: {
                            role_id: user.usr_role_id
                        },
                        attributes: Object.keys(RoleRouteMap.attributes).concat([
                            [ sequelize.literal('IFNULL((SELECT `route_parent`.`route_id` FROM `routemst` AS `route_parent` WHERE (`route_parent`.`route_left` < `Route`.`route_left` AND `route_parent`.`route_right` > `Route`.`route_right`) AND route_active = 1 ORDER BY `route_parent`.`route_depth` DESC LIMIT 1), 0)'), 'route_parent' ],
                            [ sequelize.literal('(SELECT COUNT(*) FROM `routemst` AS `subRoute` WHERE (`subRoute`.`route_left` > `Route`.`route_left` AND `subRoute`.`route_right` < `Route`.`route_right`) AND route_active = 1)'), 'subMenu' ]
                        ]),
                        logging: false
                    }).then(function (rs) {
                        sequelize.close();
                        res.status(200).json({ 
                            data: rs
                        });
                    });

                    return null;
                }).catch(function (err) {
                    sequelize.close();
                    res.status(400);
                    console.log(err);
                });
            });
    } catch (e) {
        console.log(e, __filename);
    }
};