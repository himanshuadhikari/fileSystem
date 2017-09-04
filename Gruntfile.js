module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    var staticConnect = require("serve-static")

    grunt.initConfig({
        watch: {
            dev: {
                options: {
                    livereload: 35730 // livereaload option added!
                },
                files: ['src/index.html', 'src/scripts/**/*.js']
            }
        },
        connect: {
            options: {
                port: 8000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35730,
                keepalive: true
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function(connect, options) {
                        return [
                            function(req, res, next) {
                                next();
                            },
                            staticConnect('.tmp'),
                            connect().use(
                                '/bower_components',
                                staticConnect('./bower_components')
                            ),
                            staticConnect('src')
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            staticConnect('.tmp'),
                            staticConnect('test'),
                            connect().use(
                                '/bower_components',
                                staticConnect('./bower_components')
                            ),
                            staticConnect('src')
                        ];
                    }
                }
            }
        },
        concurrent: {
            dev: ['connect:livereload', 'watch:dev'] // connect and watch running concurrently!
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                port: 9999,
                singleRun: true,
                browsers: ['PhantomJS'],
                logLevel: 'ERROR'
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['src/scripts/**/*.js'],
                dest: 'dist/fileSystem.js',
            }
        },
        uglify: {
            options: {
                preserveComments: 'some',
            },
            min: {
                files: {
                    'dist/fileSystem.min.js': ['dist/fileSystem.js']
                }
            }
        }
    });


    grunt.registerTask('serve', function(target) {
        grunt.task.run(['concurrent']);
    });

    grunt.registerTask('test', [
        'karma:unit'
    ]);

    grunt.registerTask('build', [
        'concat',
        'uglify'
    ]);

};