module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('config.json'),
        deploy: grunt.file.readJSON('deploy.json'),
        'couch-compile': {
            www: {
                files: {
                    'tmp/www.json': ['dist']
                }
            }
        },
        'couch-push': {
            www: {
                options: {
                    user: '<%= config.user %>',
                    pass: '<%= config.password %>'
                },
                files: {
                    '<%= config.server %>': 'tmp/www.json'
                }
            },
            deploy: {
                options: {
                    user: '<%= deploy.user %>',
                    pass: '<%= deploy.password %>'
                },
                files: {
                    '<%= deploy.server %>': 'tmp/www.json'
                }
            }
        },
        'copy': {
            'www': {
                expand: true,
                cwd: 'www',
                src: '**/*',
                dest: 'dist/_attachments'
            }
        },
        clean: {
            www: ['dist/_attachments']
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-couch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'copy', 'couch-compile', 'couch-push:www']);
    grunt.registerTask('deploy', ['clean', 'copy', 'couch-compile', 'couch-push:deploy']);

};
