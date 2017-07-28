module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('files.json'),
        clean: {
            all: {
                src: ['dist']
            }
        },
        jshint: {
            core: {
                src: '<%= pkg.core %>'
            },
            data: {
                src: '<%= pkg.data %>'
            },
            web: {
                src: '<%= pkg.web %>'
            },
            reactnative: {
                src: '<%= pkg.reactnative %>'
            },
            options: {
                reporterOutput: null,
                eqnull: true
            }
        },
        concat: {
            core: {
                src: '<%= pkg.core %>',
                dest: 'dist/zn.core.js'
            },
            data: {
                src: '<%= pkg.data %>',
                dest: 'dist/zn.data.js'
            },
            web: {
                src: '<%= pkg.web %>',
                dest: 'dist/zn.web.js'
            },
            reactnative: {
                src: '<%= pkg.reactnative %>',
                dest: 'dist/zn.reactnative.js'
            }
        },
        uglify: {
            core: {
                src: ['dist/zn.core.js'],
                dest: 'dist/zn.core.minx.js',
                options: {
                    beautify: {
                        ascii_only: true
                    }
                }
            },
            data: {
                src: ['dist/zn.data.js'],
                dest: 'dist/zn.data.minx.js',
                options: {
                    beautify: {
                        ascii_only: true
                    }
                }
            },
            web: {
                src: ['dist/zn.web.js'],
                dest: 'dist/zn.web.minx.js',
                options: {
                    beautify: {
                        ascii_only: true
                    }
                }
            },
            reactnative: {
                src: ['dist/zn.reactnative.js'],
                dest: 'dist/zn.reactnative.minx.js',
                options: {
                    beautify: {
                        ascii_only: true
                    }
                }
            },
            znweb: {
                src: ['dist/zn.core.js', 'dist/zn.web.js'],
                dest: 'dist/znweb.minx.js',
                options: {
                    beautify: {
                        ascii_only: true
                    }
                }
            },
            zn: {
                src: ['dist/zn.core.js', 'dist/zn.data.js', 'dist/zn.web.js'],
                dest: 'dist/zn.minx.js',
                options: {
                    beautify: {
                        ascii_only: true
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib');

    grunt.registerTask('default', ['clean', 'jshint', 'concat', 'uglify']);
    grunt.registerTask('test', ['clean', 'concat']);

};
