var AuthModel = {
    /**
     *
     * @param clientId is companymap.comp_id
     * @param clientSecret is companymap.comp_custid
     * @param done
     * @see https://github.com/thomseddon/node-oauth2-server/
     */
    getClient: function (clientId, clientSecret, done) {
        // console.log('getClient.clientId:', clientId);
        // console.log('getClient.clientSecret:', clientSecret);
        var dbConn = require(__dirname + '/../../DatabaseConnection.js'),
            options = {logging: false},
            sequelize = dbConn.createSequelize(process.env.NODE_ENV, options),
            client = {
                clientId: clientId,
                redirectUri: ''
            };

        sequelize.authenticate().then(function () {
            if (typeof done === 'function') {
                done(null, client);
            }
            return null;
        }, function (e) {
            console.log('Failed Authentication', e);
            if (typeof done === 'function') {
                done(new Error());
            }
            return null;
        });
    },
    /**
     *
     * @param clientId companymap.comp_id
     * @param grantType
     * @param done
     * @see https://github.com/thomseddon/node-oauth2-server/
     */
    grantTypeAllowed: function (clientId, grantType, done) {
        // console.log('grantTypeAllowed.clientId:', clientId);
        // console.log('grantTypeAllowed.grantType:', grantType);

        // Currently, allow all clients to use these grant types
        if (grantType === 'client_credentials' || grantType === 'refresh_token') {
            if (typeof done === 'function') {
                done(null, true);
            }
        } else {
            if (typeof done === 'function') {
                done(new Error());
            }
        }
        return null;
    },
    getUserFromClient: function (clientId, clientSecret, done) {
        // console.log('getUserFromClient.clientId:', clientId);
        // console.log('getUserFromClient.clientSecret:', clientSecret);

        var dbConn = require(__dirname + '/../../DatabaseConnection.js'),
            options = {logging: false},
            sequelize = dbConn.createSequelize(process.env.NODE_ENV, options),
            User = dbConn.getModel(sequelize, 'User'),
            userLogin = clientSecret.split(':')[0] || '',
            userPassword = clientSecret.split(':')[1] || '';

        return User.findOne({ where: { usr_title: userLogin }}).then(function (user) {
            if (!user) {
                sequelize.close();
                if (typeof done === 'function') {
                    done(null);
                }
            } else if (user.checkPassword(userPassword) === true) {
                if (typeof done === 'function') {
                    done(null, user);
                }
            } else {
                sequelize.close();
                if (typeof done === 'function') {
                    return done(new Error());
                }
            }

            return null;
        }).catch(function (err) {
            sequelize.close();
            console.log(err);
            if (typeof done === 'function') {
                return done(new Error('Error when finding user: ', err));
            }
            return null;
        });
    },
    /**
     *
     * @param accessToken
     * @param clientId
     * @param expires
     * @param user
     * @param done
     * @see https://github.com/thomseddon/node-oauth2-server/
     */
    saveAccessToken: function (accessToken, clientId, expires, user, done) {
        // console.log('saveAccessToken.accessToken:', accessToken);
        // console.log('saveAccessToken.clientId:', clientId);
        var Tokens = require(__dirname + '/../../DatabaseConnection.js').getModel(user.sequelize, 'Tokens'),
            sqlIdNo = 'CONCAT(UNIX_TIMESTAMP(), ' + Math.floor((Math.random() * 89) + 10) + ')';

        Tokens.create({
            usr_id: user.usr_id,
            action: 'access',
            value: accessToken,
            tkn_expiry_date: expires,
            tkn_sys_add_date: new Date()
        }).then(function () {
            // user.sequelize.close();
            if (typeof done === 'function') {
                done(null);
            }
            return null;
        }).catch(function (e) {
            user.sequelize.close();
            console.log(e);
            if (typeof done === 'function') {
                console.log('saveAccessToken.err');
                return done(new Error()); // truthy means has error
            }
            return null;
        });
    },
    /**
     *
     * @param bearerToken
     * @param done
     * @see https://github.com/thomseddon/node-oauth2-server/
     */
    getAccessToken: function (bearerToken, done) {
        // console.log('getAccessToken.bearerToken:', bearerToken);
        console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
        try {
            var accessToken = bearerToken || '',
                dbConn = require(__dirname + '/../../DatabaseConnection.js'),
                options = {logging: false},
                sequelize = dbConn.createSequelize(process.env.NODE_ENV, options),
                Tokens = dbConn.getModel(sequelize, 'Tokens');

            if (!accessToken) {
                // console.log('getAccessToken.!accessToken');
                if (typeof done === 'function') {
                    return done(new Error());
                }
            }

            return Tokens.find({where: {value: accessToken}}).then(function (data) {
                // console.log('getAccessToken.Tokens.find: ', data);
                if (data) {
                    var token = {
                        user: {
                            usr_id: data.usr_id,
                            sequelize: sequelize
                        },
                        expires: data.tkn_expiry_date
                    };
                    if (typeof done === 'function') {
                        done(null, token);
                    }
                } else {
                    // if (typeof done === 'function') {
                        console.log('getAccessToken.Tokens.find.err');
                        done(null, true);
                        // throw new Error('access token not found!');
                    // }
                }

                return null;
            });
        } catch (err) {
            console.log('getAccessToken.catch', err);
            done(true);
        }
    },
    /**
     *
     * @param refreshToken
     * @param clientId
     * @param expires
     * @param user
     * @param done
     * @see https://github.com/thomseddon/node-oauth2-server/
     */
    saveRefreshToken: function (refreshToken, clientId, expires, user, done) {
        // console.log('saveRefreshToken.refreshToken: ', refreshToken);
        // console.log('saveRefreshToken.clientId: ', clientId);

        var Tokens = require(__dirname + '/../../DatabaseConnection.js').getModel(user.sequelize, 'Tokens');

        Tokens.create({
            usr_id: user.usr_id,
            action: 'refresh',
            value: refreshToken,
            tkn_expiry_date: expires,
            tkn_sys_add_date: new Date()
        }).then(function () {
            user.sequelize.close();
            if (typeof done === 'function') {
                done(null); // falsey means no error
            }
            return null;
        }, function (e) {
            user.sequelize.close();
            console.log(e);
            if (typeof done === 'function') {
                return done(new Error()); // truthy means has error
            }
            return null;
        }).catch(function (e) {
            user.sequelize.close();
            console.log(e);
            if (typeof done === 'function') {
                return done(new Error()); // truthy means has error
            }
            return null;
        });
    },
    /**
     *
     * @param refreshToken
     * @param done
     * @see https://github.com/thomseddon/node-oauth2-server/
     */
    getRefreshToken: function (refreshToken, done) {
        // console.log('getRefreshToken', refreshToken);
        // Not yet implement, see getAccessToken
        if (typeof done === 'function') {
            return done(new Error());
        }
    },


    /**
     * Save loggedIn session while generateToken
     * 
     * @param type
     * @param req
     * @param done
     */
    generateToken: function (type, req, done) {
        req.user.remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (typeof done === 'function') {
            done(null, null);
        }
        // req.session.loggedIn = true;
        // req.session.save(function () {
        //     if (typeof done === 'function') {
        //         done(false, null);
        //     }
        // });
    }
};

module.exports = AuthModel;