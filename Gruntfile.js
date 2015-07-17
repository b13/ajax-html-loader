config = {
	testCodeDirectory: __dirname + '/test/',
	testServerPath: 'test/server/server.coffee',
	testServerPort: 7777
}

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg   : grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> @ <%= pkg.company.name%>' +
		' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.

		clean: {
			build: ['dist/*'],
			dev :  ['test/dist/js/contrib/ajax-html-loader.js'],
			test : ['test/dist/*']
		},

		copy: {
			release: {
				files: [{expand: true, flatten: true, src: ['src/ajax-html-loader.js'], dest: 'dist/'}]
			},
			dev: {
				files: [
					{expand: true, flatten: true, src: ['src/ajax-html-loader.js'], dest: 'test/dist/js/contrib/'}
				]
			},
			test: {
				files: [
					{expand: true, flatten: true, src: ['bower_components/jquery/dist/jquery.js'], dest: 'test/dist/js/contrib/'},
					{expand: true, flatten: true, src: ['bower_components/requirejs/require.js'], dest: 'test/dist/js/contrib/'},
					{expand: true, flatten: true, src: ['src/ajax-html-loader.js'], dest: 'test/dist/js/contrib/'},
					{expand: true, flatten: true, src: ['test/src/js/test.js'], dest: 'test/dist/js/'}
				]
			}
		},

		concurrent: {
			dev: {
				tasks  : ['nodemon:dev', 'watch:dev'],
				options: {logConcurrentOutput: true}
			}
		},

		less: {
			test: {
				options: {
					compress    : false,
					yuicompress : false,
					cleancss    : false,
					optimization: null
				},
				files: {
					"test/dist/css/test.css": "test/src/less/test.less"
				}
			}
		},

		nodemon: {
			dev: {
				script : 'test/server/server.coffee',
				options: {
					env  : {
						PORT     : config.testServerPort,
						DIRECTORY: config.testCodeDirectory
					},
					ignore: ['**']
				}
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist   : {
				src : 'dist/ajax-html-loader.js',
				dest: 'dist/ajax-html-loader.min.js'
			}
		},

		watch : {
			dev: {
				files: ['src/**/*.js'],
				tasks: ['clean:dev', 'copy:dev']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');

	grunt.registerTask('release', ['copy:release', 'uglify']);

	grunt.registerTask('devBuild', ['clean:test', 'copy:test', 'less:test']);
	grunt.registerTask('dev', ['devBuild', 'concurrent:dev']);

};