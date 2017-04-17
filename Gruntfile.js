var colors = require('colors/safe'),
    DOMParser = require('xmldom').DOMParser,
    XMLSerializer = require('xmldom').XMLSerializer,
    fs = require('fs'),
    path = require('path'),
    walk = require('walk');

colors.setTheme({
    silly: 'rainbow',
    code: 'white',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'green',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
    underline: 'underline',
    separator: 'blue'
});


/**
 * @file Gruntfile.js
 */
module.exports = function (grunt) {

    var uiDir = 'ui',
        dropConsole = (grunt.option('drop-console') !== undefined) ? grunt.option('drop-console') : true,
        ignoreCert = (grunt.option('ignore-cert') !== undefined) ? grunt.option('ignore-cert') : false,
        dropUglify = (grunt.option('drop-uglify') !== undefined) ? grunt.option('drop-uglify') : false,
        env = (grunt.option('env') !== undefined)? grunt.option('env'): 'development';
        nwVersion = '0.16.1',
        appVersion = '1.0.0',
        buildDir = path.resolve(__dirname + '/build/releases'),
        cssMinCombileFiles = {},
        uglifyICSFiles = {},
        uglifyLibFiles = {},
        arrConcatSrc = [
            'app/models/**/*.js', // Must concat before app.js
            'app/routes/**/*.js',
            'app/app.js',
            'app/directives/**/*.js',
            'app/factories/**/*.js',
            'app/services/**/*.js',
            'app/controllers/**/*.js'
        ],
        arrJzzModules = [
            'app/views/default/lib/JZZ-modules/javascript/JZZ.js',
            'app/views/default/lib/JZZ-modules/javascript/JZZ.MIDI.js',
            'app/views/default/lib/JZZ-modules/javascript/JZZ.synth.MIDIjs.js'
        ];
    // ,'app/views/default/lib/JZZ-modules/javascript/JZZ.synth.OSC.js',
    // 'app/views/default/lib/JZZ-modules/javascript/JZZ.synth.Timbre.js',
    // 'app/views/default/lib/JZZ-modules/javascript/JZZ.input.ASCII.js',
    // 'app/views/default/lib/JZZ-modules/javascript/JZZ.input.Kbd.js',
    // 'app/views/default/lib/JZZ-modules/javascript/JZZ.input.Knobs.js',
    // 'app/views/default/lib/JZZ-modules/javascript/JZZ.input.Qwerty.js',
    // 'app/views/default/lib/JZZ-modules/javascript/JZZ.qwerty-hancock.js',
    // 'app/views/default/lib/JZZ-modules/javascript/timbre.js'

    cssMinCombileFiles[uiDir + '/lib/all.css'] = ['tmp/lib/**/*.css', uiDir + '/lib/**/*.css', uiDir + '/css/**/*.css'];
    uglifyICSFiles[uiDir + '/lib/pbe.min.js'] = ['tmp/lib/pbe.min.js'];
    uglifyLibFiles[uiDir + '/lib/all.js'] = ['tmp/lib/all.js'];

    if (grunt.option('verbose')) {
        console.log('dropConsole:', dropConsole);
        console.log('dropUglify:', dropUglify);
        console.log('ignoreCert:', ignoreCert);
    }

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        nwjs: {
            options: {
                version: nwVersion,
                platforms: ['win', 'osx64'],
                buildDir: buildDir
                
            },
            src: ['./' + uiDir + '/**/*']
        },

        /**
         * Clean files before build
         * @external grunt-contrib-clean
         * @see {@link https://github.com/gruntjs/grunt-contrib-clean}
         */
        clean: {
            all: ['./' + uiDir + '/**/*', './tmp/**/*', './cordova/www/**/*'],
            build: ['./' + uiDir + '/**/*', './tmp/**/*', './cordova/www/**/*'],
            desktopPackageJSON: ['./' + uiDir + '/package.json']
        },
        
        bower_concat: {
            main: {
                // dest: 'tmp/lib/all.js',
                dest: {
                    'js': 'tmp/lib/all.js',
                    'css': 'tmp/lib/all.css'
                },
                dependencies: {
                    'angular': 'jquery',
                    'angular-bootstrap': 'angular',
                    'angular-animate': 'angular',
                    'angular-cookies': 'angular',
                    'angularjs-camelCase-human': 'angular',
                    'angular-bootstrap-datetimepicker-directive': ['angular', 'eonasdan-bootstrap-datetimepicker', 'jquery'],
                    'angular-resource': 'angular',
                    'angular-route': 'angular',
                    'angular-awesome-slider': 'angular',
                    'angularUtils-pagination': 'angular',
                    'bootstrap': 'jquery',
                    'bootstrap-material-design': ['jquery', 'bootstrap'],
                    'ngCordova': 'angular',
                    'ngSweetAlert': ['angular', 'sweetalert'],
                    'noty': 'jquery',
                    'jquery': 'localforage',
                    'jquery-connections': 'jquery',
                    'ui-slider': 'jquery'
                },
                bowerOptions: {
                    relative: false
                },
                mainFiles: {
                    'bootstrap': ['dist/css/bootstrap.css'],
                    'bootstrap-material-design': [
                        'dist/css/bootstrap-material-design.css', 
                        'dist/css/ripples.css',
                        'dist/js/ripples.js',
                        'dist/js/material.js'],
                    'material-design-icons': ['iconfont/material-icons.css'],
                    'JZZ-modules': [
                        'javascript/JZZ.js',
                        'javascript/JZZ.MIDI.js',
                        'javascript/JZZ.synth.MIDIjs.js'],
                    'MIDI.js': [
                        'inc/shim/Base64.js',
                        'inc/shim/Base64binary.js',
                        'inc/shim/WebAudioAPI.js',
                        'inc/shim/WebMIDIAPI.js',
                        'inc/jasmid/replayer.js',
                        'inc/jasmid/midifile.js',
                        'inc/jasmid/stream.js',
                        'js/midi/audioDetect.js',
                        'js/midi/gm.js',
                        'js/midi/loader.js',
                        'js/midi/plugin.audiotag.js',
                        'js/midi/plugin.webaudio.js',
                        'js/midi/plugin.webmidi.js',
                        'js/midi/player.js',
                        'js/util/dom_request_script.js',
                        'js/util/dom_request_xhr.js'
                    ]
                    // ,'bootstrap-material-design': ['dist/css/bootstrap-material-design.css', 'dist/css/ripples.css', 'dist/js/ripples.js', 'dist/js/material.js']
                }
            }
        },
       

        /**
         * Concat all bower_components into all.js
         * @external grunt-contrib-copy
         * @see {@link https://github.com/gruntjs/grunt-contrib-copy}
         */
        copy: {
            default: {
                files: [ 
                    {expand: true, cwd: 'app/views/default', src: ['**/*'], dest: uiDir + '/'},
                    {expand: true, cwd: 'app/views/default/js', src: ['nodes.js', 'JZZ.Midi.js', 'JZZ.MidiFile.js'], dest: uiDir + '/lib/'},
                    // {expand: true, cwd: 'app/views/default/js/shim', src: ['Base64.js', 'Base64binary.js', 'WebAudioAPI.js', 'WebMIDIAPI.js'], dest: uiDir + '/lib/'},
                    // {expand: true, cwd: 'app/views/default/js/jasmid', src: ['stream.js', 'midifile.js', 'replayer.js'], dest: uiDir + '/lib/'},
                    {expand: true, cwd: 'bower_components/bootstrap/fonts', src: ['*'], dest: uiDir + '/fonts/'},
                    {expand: true, cwd: 'bower_components/JZZ-modules/html/soundfont', src: ['**/*'], dest: uiDir + '/soundfont/'},
                    // {expand: true, cwd: 'node_modules/jzz', src: ['**/*'], dest: uiDir + '/lib/jzz/'},
                    // {expand: true, cwd: 'node_modules/jazz-midi', src: ['**/*'], dest: uiDir + '/lib/jzz-midi/'},
                    {expand: true, cwd: 'bower_components/material-design-icons/iconfont', src: ['*.eot', '*.ttf', '*.woff', '*.woff2'], dest: uiDir + '/lib/'},
                    {expand: true, cwd: 'bower_components/angular-awesome-slider/src/img', src: ['*'], dest: uiDir + '/img/'},
                    // {expand: true, cwd: 'node_modules/jazz-midi', src: ['**/*'], dest: uiDir + '/node_modules/jazz-midi'},
                    // {expand: true, cwd: 'storages', src: ['**/*'], dest: uiDir + '/storages/'},
                ]
            },
            cordova: {
                files: [{expand: true, cwd: uiDir, src: ['**/*'], dest: 'cordova/www'}]
            },
            noUglify: {
                files: [{expand: true, cwd: 'tmp', src: ['lib/pbe.min.js', 'lib/all.js'], dest: uiDir}]
            }
        },
        // {expand: true, cwd: 'app/views/default/lib/JZZ-modules/javascript', src: ['*'], dest: uiDir + '/lib/jazz-modules/'}

        /**
         * Concat all css into all.css
         * @external grunt-contrib-cssmin
         * @see {@link https://github.com/gruntjs/grunt-contrib-cssmin}
         */
        cssmin: {
            combine: {
                files: cssMinCombileFiles
            }
        },

        /**
         * Concat application files
         * @external grunt-contrib-concat
         * @see {@link https://github.com/gruntjs/grunt-contrib-concat}
         */
        concat: {
            options: {
                stripBanners: {block: true, line: true},
                banner: "'use strict';\n",
                process: function (src, filepath) {
                    return '// Source: ' + filepath + '\n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            dist: {
                src: arrConcatSrc,
                dest: 'tmp/lib/pbe.min.js'
            }
        },

        /**
         * Minify local function names and shorten all javascript codes to one line
         * @external grunt-contrib-uglify
         * @see {@link https://github.com/gruntjs/grunt-contrib-uglify}
         */
        uglify: {
            pbe: {
                options: {
                    mangle: !dropUglify,
                    beautify: dropUglify,
                    compress: {
                        sequences: !dropUglify,
                        conditionals: !dropUglify,
                        comparisons: !dropUglify,
                        loops: !dropUglify,
                        cascade: !dropUglify,
                        if_return: !dropUglify,
                        join_vars: !dropUglify,
                        warnings: !dropConsole,
                        drop_console: dropConsole,
                        drop_debugger: dropConsole,
                        keep_fnames: true,
                        unsafe: false
                    },
                    preserveComments: !dropConsole
                },
                files: uglifyICSFiles
            },
            lib: {
                options: {
                    compress: {
                        drop_console: dropConsole,
                        warnings: !dropConsole
                    },
                    preserveComments: !dropConsole
                },
                files: uglifyLibFiles
            }
        },

        exec: {
            cordova_run_android: {
                cwd: 'cordova',
                command: 'cordova run android'
            },
            build_init: {
                command: 'node scripts/buildInit.js --env ' + grunt.option('env')
            }
        }
    });

    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-jsdoc');
    // grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-exec');


   /**
     * Default task display help messages
     */
    grunt.registerTask('default', function () {

        // Display README.md on console
        try {
            var lines = fs.readFileSync('README.md', {enconding: 'utf-8'}).toString().split('\n');

            lines.forEach(function (line) {
                if (/^\<u\>(.*?)\<\/u\>$/.test(line.trim()) === true) {
                    line = line.replace('<u>', '');
                    line = line.replace('</u>', '');
                    console.log(colors.separator(colors.underline(line)));
                } else if (/^\=(.*?)\=$/.test(line.trim()) === true) {
                    console.log(colors.separator(line));
                } else if (/^Problem\:/.test(line) === true) {
                    console.log(colors.warn(line));
                } else if (/^Solution\:/.test(line) === true) {
                    console.log(colors.help(line));
                } else if (line[line.length - 1] === ':') {
                    console.log(colors.verbose(line));
                } else if (line[0] === '\t' || line[0] === ' ') {
                    console.log(colors.code(line));
                } else {
                    console.log(colors.help(line));
                }
            });
        } catch (e) {
            console.log(colors.error(e));
        }
    });

    /**
     * Replace {{var}} in the app temporary file
     */
    grunt.task.registerTask('genConfig', 'Generate configuration file', function () {
        var serializer = new XMLSerializer(),
            done = this.async(),
            tmp = fs.readFileSync(__dirname + '/tmp/lib/pbe.min.js').toString(),
            tmp2 = fs.readFileSync(__dirname + '/' + uiDir + '/index.html').toString();

        fs.writeFileSync(__dirname + '/tmp/lib/pbe.min.js', tmp);
        fs.writeFileSync(__dirname + '/' + uiDir + '/index.html', tmp2);

        done();
    });
    /**
     * Write package.json for Desktop App
     */
    grunt.task.registerTask('genDesktopPackageJSON', 'Generate package.json file', function () {
        var done = this.async();

        _createPackageJsonFile('./app/views/default/package.json', './' + uiDir + '/package.json');

        done();
    });

    grunt.registerTask('buildInit', 'exec:build_init');

    /**
     * Add ignore-certificate-errors flag if needed.
     * Modify to add app version and append (Dev.) if it's a development environment
     * @param packageJSONPath
     * @param outputPackageJSONPath
     * @private
     */
    function _createPackageJsonFile(packageJSONPath, outputPackageJSONPath) {

        var packageJson = require(packageJSONPath);
        // console.log('packageJson: ', packageJson);
        // console.log('ignore_cert', ignoreCert);

        if (ignoreCert === true) {
            packageJson['chromium-args'] = '--ignore-certificate-errors';
        }
        packageJson['version'] = appVersion;
        // packageJson['description'] = packageJson['description'] + ' ' + appVersion;
        // packageJson['window'].title = packageJson['window'].title + ' ' + appVersion;

        var strConfig = JSON.stringify(packageJson);

        fs.writeFileSync(outputPackageJSONPath, strConfig);
    }

    var arrPrepareTasks = ['clean:build', 'bower_concat', 'copy:default', 'cssmin', 'concat'],
        arrWebTasks = arrPrepareTasks.slice(0),
        arrDesktopTasks = arrPrepareTasks.slice(0),
        arrMobileTasks = arrPrepareTasks.slice(0);



    // Web UI and APIs
    arrWebTasks.push('genConfig', 'uglify:pbe', 'uglify:lib');
    grunt.registerTask('default', arrWebTasks);

    arrMobileTasks.push('genConfig', 'uglify:pbe', 'uglify:lib', 'copy:cordova');
    grunt.registerTask('app', arrMobileTasks);
    grunt.registerTask('app:android', arrMobileTasks.concat(['exec:cordova_run_android']));

    // Node Webkit Desktop App
    arrDesktopTasks.push('genDesktopPackageJSON', 'genConfig', 'uglify:pbe', 'uglify:lib', 'nwjs', 'clean:desktopPackageJSON');
    grunt.registerTask('desktop', arrDesktopTasks);


};