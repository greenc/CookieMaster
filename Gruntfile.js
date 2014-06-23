module.exports = function(grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            less: {
                files: ['src/less/**/*.less'],
                tasks: ['less'],
                options: {
                    interrupt: true
                }
            }
        },
        /**
         * Remove all files from build directory
         */
        clean: {
            build: {
                src: [ 'build', 'dist', 'chrome-extension/dist' ]
            },
        },
        /**
         * Copy files into build directories
         */
        copy: {
            bs: {
                src:  'src/cm-bootstrap.js',
                dest: 'build/cm-bootstrap.js',
            },
            bmb: {
                src:  'src/bookmarklet.js',
                dest: 'build/bookmarklet.js',
            },
            bmd: {
                src:  'src/bookmarklet.js',
                dest: 'dist/bookmarklet.js',
            },
            chromeCSS: {
                src:  'dist/cookiemaster.min.css',
                dest: 'chrome-extension/dist/cookiemaster.min.css',
            },
            chromeJS: {
                src:  'dist/cookiemaster.min.js',
                dest: 'chrome-extension/dist/cookiemaster.min.js',
            }
        },
        /**
         * Compile the LESS into CSS
         */
        less: {
            local: {
                options: {
                    paths: ["src/less/imports"]
                },
                files: {
                    "build/cookiemaster.css": "src/less/cookiemaster.less"
                }
            }
        },
        /**
         * Minify the other JS files into the build directory
         */
        uglify: {
            build: {
                files: {
                    'dist/cm-bootstrap.min.js':     'build/cm-bootstrap.js',
                    'dist/cookiemaster.min.js':     'build/cookiemaster.js'
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
                    'dist/cookiemaster.min.css':        'build/cookiemaster.css',
                    'site/css/jumbotron-narrow.min.css': 'site/css/jumbotron-narrow.css'
                }
            }
        },
        /**
         * Minify the CSS files
         */
        cssmin: {
            build: {
                src:  'dist/cookiemaster.min.css',
                dest: 'dist/cookiemaster.min.css'
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
                    'src/*.js',
                    'src/*.css',
                    'src/less/*.less',
                    'chrome-extension/manifest.json'
                ]
            },
        },
        /**
         * Concatenate source JS files into build directory
         */
        concat: {
            build: {
                src: ['src/external-methods.js', 'src/cookiemaster.js'],
                dest: 'build/cookiemaster.js'
            }
        },
        /**
         * Execute string replacements on paths and URLs
         */
        replace: {
            paths: {
                src: 'dist/cookiemaster.min.js',
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
                src: ['dist/cm-bootstrap.min.js'],
                overwrite: true,
                replacements: [
                    {
                        from: 'http://',
                        to:   '//'
                    },
                    {
                        from: '../cookiemaster',
                        to:   '<%= pkg.cookieMasterURL %>'
                    },
                    {
                        from: 'build/cookiemaster.js',
                        to:   'cookiemaster.min.js'
                    },
                    {
                        from: 'build/cookiemaster.css',
                        to:   'cookiemaster.min.css'
                    }
                ]
            },
            bm: {
                src: ['dist/bookmarklet.js'],
                overwrite: true,
                replacements: [
                    {
                        from: '../cookiemaster/build/cm-bootstrap.js',
                        to:   '//cookiemaster.creatale.de/b'
                    }
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
        'version',        // Updates version number across all src/ files
        'clean',          // Cleans [build, dist, chrome-extension/dist]/ directories
        'less',           // src/less/*.less > build/cookiemaster.css
        'css',            // build/cookiemaster.css > dist/cookiemaster.min.css (also site CSS)
        'concat',         // src/external-methods.js + src/cookiemaster.js > build/cookiemaster.js
        'copy:bs',        // src/cm-bootstrap.js > build/cm-bootstrap.js
        'copy:bmb',       // src/bookmarklet.js > build/bookmarklet.js
        'uglify',         // build/cookiemaster.js > dist/cookiemaster.min.js
        'replace:paths',  // Replace local paths in build/cookiemaster.min.js with production URLs
        'replace:min',    // Replace local paths in dist/cm-bootstrap.min.js with production URLs
        'copy:bmd',       // src/bookmarklet.js > dist/bookmarklet.js
        'replace:bm',     // Replace local path in dist/bookmarklet.js with production URL
        'copy:chromeCSS', // dist/cookiemaster.min.css > chrome-extension/dist/cookiemaster.min.css
        'copy:chromeJS',  // dist/cookiemaster.min.js > chrome-extension/cookiemaster.min.js
        'compress'        // Compress chrome-extension/ into a ZIP file for upload to Chrome Web Store
    ]);

};