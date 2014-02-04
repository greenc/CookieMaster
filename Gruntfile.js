module.exports = function(grunt) {

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Remove all files from build directory
		 */
		clean: {
			build: {
				src: [ 'build', 'chrome-extension/build' ]
			},
		},
		/**
		 * Copy files into build directories
		 */
		copy: {
			bookmarklet: {
				src: 'src/bookmarklet.js',
				dest: 'build/bookmarklet.js',
			},
			chromeCSS: {
				src: 'src/cookiemaster.css',
				dest: 'chrome-extension/build/cookiemaster.css',
			},
			chromeCM: {
				src: 'src/cookiemaster.js',
				dest: 'chrome-extension/build/cookiemaster.js',
			},
			chromeEM: {
				src: 'src/external-methods.js',
				dest: 'chrome-extension/build/external-methods.js',
			}
		},
		/**
		 * Minify the other JS files into the build directory
		 */
		uglify: {
			build: {
				files: {
					'build/cm-bootstrap.min.js': 'src/cm-bootstrap.js',
					'build/external-methods.min.js': 'src/external-methods.js',
					'build/cookiemaster.min.js': 'src/cookiemaster.js'
				}
			}
		},
		/**
		 * Optimize the CSS file
		 */
		cssc: {
			build: {
				options: {
					consolidateViaDeclarations: true,
					consolidateViaSelectors:    true
				},
				files: {
					'build/cookiemaster.min.css': 'src/cookiemaster.css',
					'site/css/jumbotron-narrow.min.css': 'site/css/jumbotron-narrow.css'
				}
			}
		},
		/**
		 * Minify the CSS file
		 */
		cssmin: {
			build: {
				src:  'build/cookiemaster.min.css',
				dest: 'build/cookiemaster.min.css'
			},
			site: {
				src: 'site/css/jumbotron-narrow.css',
				dest: 'site/css/jumbotron-narrow.min.css'
			}
		},
		/**
		 * Increment version number across all files
		 */
		version: {
			options: {
				prefix: '[^\\-_][Vv]ersion[\'"]?\\s*[:=]\\s*[\'"]?'
			},
			defaults: {
				src: [
					'src/external-methods.js',
					'src/cookiemaster.js',
					'src/cookiemaster.css',
					'src/cm-bootstrap.js',
					'chrome-extension/manifest.json'
				]
			},
		},
		/**
		 * Change paths to production ones on build
		 */
		replace: {
			sources: {
				src: [
					'build/cm-bootstrap.min.js',
					'build/bookmarklet.js',
					'build/cookiemaster.min.js',
					'chrome-extension/build/cookiemaster.js'
				],
				overwrite: true,
				replacements: [
					{
						from: '../cookiemaster/assets/gc.mp3',
						to: '<%= pkg.url %>/assets/gc.mp3'
					},
					{
						from: '../cookiemaster/assets/sp.mp3',
						to: '<%= pkg.url %>/assets/sp.mp3'
					},
					{
						from: '../cookiemaster/src/external-methods.js',
						to: '<%= pkg.url %>/build/external-methods.min.js'
					},
					{
						from: '../cookiemaster/src/cookiemaster.js',
						to: '<%= pkg.url %>/build/cookiemaster.min.js'
					},
					{
						from: '../cookiemaster/src/cookiemaster.css',
						to: '<%= pkg.url %>/build/cookiemaster.min.css'
					},
					{
						from: '../cookiemaster/src/cm-bootstrap.js',
						to: '<%= pkg.url %>/build/cm-bootstrap.min.js'
					},
					{
						from: '../cookiemaster/package.json',
						to: '<%= pkg.url %>/package.json'
					}
				]
			},
			ccLink: {
				src: ['build/cookiemaster.min.js', 'chrome-extension/build/cookiemaster.js'],
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
	grunt.registerTask('build', ['clean', 'copy', 'css', 'uglify', 'replace']);

};