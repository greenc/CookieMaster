module.exports = function(grunt){

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		clean: {
			build: {
				src: [ 'build' ]
			},
		},
		uglify: {
			build: {
				files: {
					'build/cm-bootstrap.min.js': 'src/cm-bootstrap.js',
					'build/cookiemaster.min.js': 'src/cookiemaster.js'
				}
			}
		},
		cssc: {
			build: {
				options: {
					consolidateViaDeclarations: true,
					consolidateViaSelectors:    true
				},
				files: {
					'build/cookiemaster.min.css': 'src/cookiemaster.css'
				}
			}
		},
		cssmin: {
			build: {
				src: 'build/cookiemaster.min.css',
				dest: 'build/cookiemaster.min.css'
			}
		},
		version: {
			options: {
				prefix: '[^\\-][Vv]ersion[\'"]?\\s*[:=]\\s*[\'"]?'
			},
			defaults: {
				src: ['src/cookiemaster.js', 'src/cookiemaster.css', 'src/cm-bootstrap.js']
			},
		},
	});

	grunt.registerTask('default', []);
	grunt.registerTask('css',  ['cssc', 'cssmin']);
	grunt.registerTask('build', ['clean', 'css', 'uglify']);

};