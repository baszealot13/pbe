"use strict";

// Setup colors for showing console.log information
var colors = require('colors/safe');
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
    code: 'white'
});

// Process script arguments
process.argv.forEach(function (val, index) {
    if (val === '--env') {
        if (process.argv[index + 1] !== undefined) {
            process.env.NODE_ENV = process.argv[index + 1];
            // console.log(colors.input('--env: %s'), process.env.NODE_ENV);
        }
    } else if (val === '--httpPort') {
        if (process.argv[index + 1] !== undefined) {
            process.env.HTTP_PORT = process.argv[index + 1];
            // console.log(colors.input('--httpPort: %s'), process.env.HTTP_PORT);
        }
    } 
    // else if (val === '--httpsPort') {
    //     if (process.argv[index + 1] !== undefined) {
    //         process.env.HTTPS_PORT = process.argv[index + 1];
    //         console.log(colors.input('--httpsPort: %s'), process.env.HTTPS_PORT);
    //     }
    // }
});

// Load environment variables
// if (process.env.NODE_ENV === undefined || process.env.HTTP_PORT === undefined || process.env.HTTPS_PORT === undefined) {
if (process.env.NODE_ENV === undefined || process.env.HTTP_PORT === undefined) {
    console.log(colors.error('NODE_ENV or HTTP_PORT or HTTPS_PORT not defined'));
    console.log(colors.help('If you do not have pm2 yet, you can install using the following command:'));
    console.log(colors.code('\tnpm install -g pm2'));
    console.log(colors.code('\tpm2 install pm2-logrotate'));
    console.log(colors.help('Start PBE services:'));
    console.log(colors.code('\tpm2 start development.json'));
    console.log(colors.help('Reload PBE services:'));
    console.log(colors.code('\tpm2 reload development.json'));
    console.log(colors.help('\tOr'));
    console.log(colors.code('\tpm2 gracefulReload development.json'));
    console.log(colors.help('Delete PBE services:'));
    console.log(colors.code('\tpm2 delete development.json'));
    process.exit(1);
}

console.log(colors.verbose('Environment:'), process.env.NODE_ENV);
var config = require(__dirname + '/config/config.json')[process.env.NODE_ENV];

function uncaughtHandler(err) {
    // prevent infinite recursion
    process.removeListener('uncaughtException', uncaughtHandler);
    console.error('Uncaught:', err);
}

if (process.env.NODE_ENV === 'production') {
    process.on('uncaughtException', uncaughtHandler);
}

var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    mkdirp = require('mkdirp'),
    walk = require('walk'),
    path = require("path"),
    btoa = require('btoa'),
    cors = require('cors'),
    multiparty = require('multiparty'),
    express = require('express'),
    // lex = require('greenlock-express'),
    bodyParser = require('body-parser'),
    oauthServer = require('oauth2-server'),
    uiDir = 'ui',
    AuthModel = require(__dirname + '/api/models/ext/AuthModel.js'),
    // serverOptions = {
    //     key: fs.readFileSync(__dirname + config.ssl.key),
    //     cert: fs.readFileSync(__dirname + config.ssl.cert)
    // },
    app = express(),
    router = express.Router();

app.use(cors());
// Load routes
var ROUTE_DIR = 'api/routes',
    routeFiles = [],
    routeWalkerOptions = {
        followLinks: false,
        listeners: {
            file: function (root, stat, next) {
                if (/^Ext/.test(stat.name) === false) {
                    routeFiles.push(stat);
                }
                next();
            },
            end: function () {
                for (var i = 0; i < routeFiles.length; i++) {

                    try {
                        if (/Route.js$/.test(routeFiles[i].name)) {
                            var routeFile = path.join(__dirname, ROUTE_DIR, routeFiles[i].name);
                            var RouteConfig = require(routeFile);
                            RouteConfig.setup(router);
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }

                }
            }
        }
    };
walk.walkSync(__dirname + '/' + ROUTE_DIR, routeWalkerOptions);


// Load extended routes
var ROUTE_EXT_DIR = 'api/routes/ext',
    routeExtFiles = [],
    routeExtWalkerOptions = {
        followLinks: true,
        listeners: {
            file: function (root, stat, next) {
                routeExtFiles.push(stat);
                next();
            },
            end: function () {
                for (var i = 0; i < routeExtFiles.length; i++) {

                    try {
                        if (/Route.js$/.test(routeExtFiles[i].name)) {
                            var routeFile = path.join(__dirname, ROUTE_EXT_DIR, routeExtFiles[i].name);
                            var RouteConfig = require(routeFile);
                            RouteConfig.setup(router);
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }

                }
            }
        }
    };
walk.walkSync(__dirname + '/' + ROUTE_EXT_DIR, routeExtWalkerOptions);

// Set multi-part body handling
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.oauth = oauthServer({
    model: AuthModel,
    grants: [
        'client_credentials',
        'refresh_token'
    ],
    debug: true,
    accessTokenLifetime: 1209600,
    refreshTokenLifetime: 4838400,
    passthroughErrors: false,
    clientIdRegex: /^[0-9]{1,10}$/i
});

app.all('/oauth/token', app.oauth.grant());

app.use('/api', app.oauth.authorise(), function (req, res, next) {
    try {
        // if (!req.session.loggedIn) {
        //     req.session.loggedIn = true;
        // }
        next();
    } catch (e) {
        res.status(REDIS_ERR.code).json(REDIS_ERR);
    }
    return null;
}, router);

if (process.env.NODE_ENV !== 'production') {
    uiDir = 'ui_' + process.env.NODE_ENV;
    // storageDir = 'storage_' + process.env.NODE_ENV;
}

// app.use('/api', router);
app.use("/node_modules", express.static('node_modules'));
app.use(express.static(__dirname + '/' + uiDir));
app.use(app.oauth.errorHandler());

var loadMidiLibraries = function (req, res) {
    var path = 'ui/media/midi';
    fs.readdir(path, function(err, files) {
        if (err) res.status(400);

        res.status(200).json({
            files: files
        });
    }); 
};

app.get('/Logout', function (req, res) {
    // try {
        // req.session.destroy(function () {
            res.status(200).json();
        // });
    // } catch (e) {
    //     res.status(REDIS_ERR.code).json(REDIS_ERR);
    // }
});

app.get('/public/api/libraries/midi', loadMidiLibraries);

app.put('/public/api/libraries/addMidi', function (req, res) {

    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('form.parse ', err);
            res.status(500).json({
                result: false,
                message: err
            });
        }

        var file = files.file[0],
            path = uiDir + '/media/midi/',
            fileType = file.originalFilename.split('.').pop();


        console.log('fileType: ', fileType);
        if (fileType.toLowerCase() !== 'mid') {
            res.status(200)
            res.json({
                result: false
            });
        } else {
            fs.readFile(file.path, function (err, data) {
                if (err) console.log(err);

                mkdirp.sync(path);

                fs.writeFile(path + file.originalFilename, data, function (err, data) {
                    if (err) console.log(err);

                    res.status(200).json({
                        result: true
                    });
                });
            });
        }
    });
});

// Set status route
app.get('/status', function (req, res) {
    var dbConn = require(__dirname + '/api/DatabaseConnection.js'),
        sequelize = dbConn.createSequelize(process.env.NODE_ENV, {logging: false});

    try {
        sequelize.query('SHOW FULL PROCESSLIST', {type: sequelize.QueryTypes.SELECT}).then(function (rsProcesses) {
            sequelize.close();

            res.send({
                env: process.env.NODE_ENV,
                pid: process.pid,
                memory: process.memoryUsage(),
                uptime: process.uptime(),
                db_processes: rsProcesses.length || false
            });
        });

    } catch (e) {
        res.send({
            env: process.env.NODE_ENV,
            pid: process.pid,
            memory: process.memoryUsage(),
            uptime: process.uptime(),
            db_processes: 'Cannot query database'
        });
        sequelize.close();
    }
});

// function drop_root () {
//     process.setgid('xeersoft');
//     process.setuid('xeersoft');
// }

// var port = 8080;
app.listen(process.env.HTTP_PORT, null, null, function () {
    // console.log('Server listening on port ' + process.env.HTTP_PORT);
    try {
        // if (process.env.HTTP_PORT === 80) {
        //     console.log('User ID:',process.getuid() + ', Group ID:',process.getgid());
        //     process.setgid('root');
        //     process.setuid('root');
        //     console.log('User ID:',process.getuid() + ', Group ID:',process.getgid());
        // } 
        
        console.log('Server listening on port ' + process.env.HTTP_PORT);
    } catch (e) {
        console.log('Cowardly refusing to keep the process alive as root.');
        process.exit(1);
    }
    
});

process.setMaxListeners(0);