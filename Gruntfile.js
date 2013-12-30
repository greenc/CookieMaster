module.exports = function(grunt) {

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
					'build/bookmarklet.js':      'src/bookmarklet.js',
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
				src:  'build/cookiemaster.min.css',
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
		replace: {
			sources: {
				src: ['build/cm-bootstrap.min.js', 'build/bookmarklet.js'],
				overwrite: true,
				replacements: [
					{
						from: '../cookiemaster/src/cookiemaster.js',
						to: '//rawgithub.com/greenc/CookieMaster/master/build/cookiemaster.min.js'
					},
					{
						from: '../cookiemaster/src/cookiemaster.css',
						to: '//rawgithub.com/greenc/CookieMaster/master/build/cookiemaster.min.css'
					},
					{
						from: '../cookiemaster/src/cm-bootstrap.js',
						to: '//rawgithub.com/greenc/CookieMaster/master/build/cm-bootstrap.min.js'
					}
				]
			},
			ccLink: {
				src: ['build/cookiemaster.min.js'],
				overwrite: true,
				replacements: [
					{
						from: 'http://dev:8080/cookieclicker/',
						to: 'http://orteil.dashnet.org/cookieclicker/'
					}
				]
			}
		}
	});

	grunt.registerTask('default', []);
	grunt.registerTask('css',  ['cssc', 'cssmin']);
	grunt.registerTask('build', ['clean', 'css', 'uglify', 'replace']);

};