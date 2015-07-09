module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('files.json'),
        clean: {
            all: {
                src: ['dest']
            }
        },
        jshint: {
            core: {
                src: '<%= pkg.core %>'
            },
            dom: {
                src: '<%= pkg.dom %>'
            },
            options: {
                eqnull: true
            }
        },
        concat: {
            core: {
                src: '<%= pkg.core %>',
                dest: 'dest/js/zn.js'
            },
            dom: {
                src: '<%= pkg.dom %>',
                dest: 'dest/js/zn-dom.js'
            }
        },
        uglify: {
            core: {
                src: ['dest/js/zn.js'],
                dest: 'dest/js/zn.minx.js',
                options: {
                    beautify: {
                        ascii_only: true
                    }
                }
            },
            dom: {
                src: ['dest/js/zn-dom.js'],
                dest: 'dest/js/zn-dom.minx.js',
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