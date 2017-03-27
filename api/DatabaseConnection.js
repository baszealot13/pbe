"use strict";
/**
 * @class DatabaseConnection
 * @memberof api
 * @example {@lang javascript}
 * var sequelize = require('./api/DatabaseConnection.js').sequelize;
 * @description Class to manage database connection
 */
var DatabaseConnection = {

    /**
     * @private
     * @description Database configuration variable loaded from ./config/config.json
     */
    config: require(__dirname + '/../config/config.json'),

    /**
     * @public
     * @static
     * @method createSequelize
     * @memberof api.DatabaseConnection
     * @description Set database connection to the parameter. Environment is configurable via .env file in project root folder
     * @return sequelize object
     * @see .env file in project root folder
     */
    createSequelize: function (environment, options) {
        var Sequelize = require('sequelize'),
            database = 'pbe_eartraining';

        // Set default options
        if (options === undefined) {
            options = {
                logging: console.log,
                pool: false
            };
        } else if (options !== null) {
            if (typeof options.logging === 'undefined') {
                options.logging = console.log;
            }
            if (typeof options.pool === 'undefined') {
                options.pool = false;
            }
        }

        if (environment !== undefined && (
                environment === 'development' ||
                environment === 'test' ||
                environment === 'production'
            )) {
            process.env.NODE_ENV = environment;
        }

        if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
            return null;
        }

        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            database = database + '_' + process.env.NODE_ENV;
        }

        // Configure database
        try {
            return new Sequelize(
                database,
                this.config[process.env.NODE_ENV].username,
                this.config[process.env.NODE_ENV].password,
                {
                    dialect: this.config[process.env.NODE_ENV].dialect,
                    host: this.config[process.env.NODE_ENV].host,
                    port: this.config[process.env.NODE_ENV].port,
                    logging: options.logging,
                    define: {engine: this.config[process.env.NODE_ENV].engine},
                    pool: options.pool
                }
            );
        } catch (errDb) {
            throw errDb;
        }

        return null;
    },

    getModel: function (sequelize, modelName) {
        return sequelize.import(__dirname + '/models/' + modelName + 'Model.js');
    }

    // _recursiveKill: function (sequelize, procIds, callback) {
    //     var self = this;

    //     if (procIds.length > 0) {
    //         var procId = procIds.pop();
    //         console.log('KILL ' + procId);
    //         sequelize.query('KILL ' + procId).then(function () {
    //             self._recursiveKill(sequelize, procIds, callback);
    //         });
    //     } else {
    //         console.log('Killed MySQL idle connections');
    //         sequelize.close();
    //         callback();
    //     }
    // },

    // killSequelize: function (callback) {
    //     var self = this;

    //     var Sequelize = self.createSequelize(process.env.NODE_ENV, { logging: false });

    //     Sequelize.query('SHOW FULL PROCESSLIST', {type: Sequelize.QueryTypes.SELECT}).then(function (rsProcesses) {
    //         var procIds = [];
    //         for (var i = 0; i < rsProcesses.length; i++) {
    //             var curProcess = rsProcesses[i];
    //             if (curProcess.Command == 'Sleep' &&
    //                 curProcess.Info === null &&
    //                 curProcess.Time > 0 &&
    //                 curProcess.db == self.config[process.env.NODE_ENV].database &&
    //                 curProcess.User == self.config[process.env.NODE_ENV].username
    //             ) {
    //                 procIds.push(curProcess.Id);
    //             }
    //         }
    //         self._recursiveKill(Sequelize, procIds, callback);
    //     });
    // }
};

module.exports = DatabaseConnection;