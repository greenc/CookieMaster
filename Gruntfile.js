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
				src:  'src/bookmarklet.js',
				dest: 'build/bookmarklet.js',
			},
			chromeCSS: {
				src:  'src/cookiemaster.css',
				dest: 'chrome-extension/build/cookiemaster.css',
			},
			chromeCM: {
				src:  'src/cookiemaster.js',
				dest: 'chrome-extension/build/cookiemaster.js',
			},
			chromeEM: {
				src:  'src/external-methods.js',
				dest: 'chrome-extension/build/external-methods.js',
			}
		},
		/**
		 * Minify the other JS files into the build directory
		 */
		uglify: {
			build: {
				files: {
					'build/cm-bootstrap.min.js':     'src/cm-bootstrap.js',
					'build/external-methods.min.js': 'src/external-methods.js',
					'build/cookiemaster.min.js':     'src/cookiemaster.js'
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
					'build/cookiemaster.min.css':        'src/cookiemaster.css',
					'site/css/jumbotron-narrow.min.css': 'site/css/jumbotron-narrow.css'
				}
			}
		},
		/**
		 * Minify the CSS files
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
			paths: {
				src: ['build/*', 'chrome-extension/build/*'],
				overwrite: true,
				replacements: [
					{
						from: '../cookiemaster',
						to:   '<%= pkg.cookieMasterURL %>'
					},
					{
						from: 'http://dev:8080/cookieclicker/',
						to:   '<%= pkg.cookieClickerURL %>'
					}
				]
			},
			min: {
				src: ['build/*'],
				overwrite: true,
				replacements: [
					{
						from: 'src/external-methods.js',
						to:   'build/external-methods.min.js'
					},
					{
						from: 'src/cookiemaster.js',
						to:   'build/cookiemaster.min.js'
					},
					{
						from: 'src/cookiemaster.css',
						to:   'build/cookiemaster.min.css'
					},
					{
						from: 'src/cm-bootstrap.js',
						to:   'build/cm-bootstrap.min.js'
					},
				]
			}
		},
		/**
		 * Zip the chrome-extension directory ready for upload
		 * to Chrome Web Store
		 */
		compress: {
			main: {
				options: {
					archive: './chrome-extension-<%= pkg.version %>.zip',
					mode:    'zip',
					level:   9
				},
				files: [
					{
						src: './chrome-extension/**'
					}
				]
			}
		}
	});

	grunt.registerTask('default', []);
	grunt.registerTask('css',  ['cssc', 'cssmin']);
	/**
	 * Main build task
	 */
	grunt.registerTask('build', [
		'version',
		'clean',
		'copy',
		'css',
		'uglify',
		'replace',
		'compress'
	]);

};