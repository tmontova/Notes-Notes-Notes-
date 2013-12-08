module.exports = function ( grunt ) {
	grunt.initConfig( {
		pkg : grunt.file.readJSON( 'package.json' ),
		clean : {
			build : [
				'public/stylesheets/application.css',
				'public/stylesheets/application.min.css',
				'public/javascripts/app.js',
				'public/javascripts/app.min.js'
			]
		},
		concat : {
			css : {
				src : [
					'public/stylesheets/header.css',
					'public/stylesheets/help.css',
					'public/stylesheets/home.css',
					'public/stylesheets/notes_style.css',
					'public/stylesheets/share.css',
					'public/stylesheets/sidebar.css',
					'public/stylesheets/style.css'
				],
				dest : 'public/stylesheets/application.css'
			},
			js : {
				src : [
					'public/javascripts/application.js',
					'public/javascripts/getResults_ajax.js',
					'public/javascripts/login.js',
					'public/javascripts/SVG.js',
					'public/javascripts/takenote.js',
					'public/javascripts/viewnote.js'
				],
				dest : 'public/javascripts/app.js'
			}
		},
		concurrent: {
			target : {
				tasks : ['nodemon', 'watch'],
				options : {
					logConcurrentOutput : true
				}
			}
		},
		csslint : {
			src : ['public/stylesheets/*.css']
		},
		cssmin : {
			options : {
				banner : '/*<%= pkg.name %> <%= grunt.template.today("mm-dd-yyyy") %>*/',
				report : 'min'
			},
			minifycss : {
				files : {
					'public/stylesheets/application.min.css' : [ 'public/stylesheets/*.css' ]
				}
			}
		},
		nodemon : {
			dev : {
				options : {
					file : 'server.js',
					ignoredFiles : ['node_modules/**', 'public/**', 'views/**', '.idea/**']
				}
			}
		},
		uglify : {
			options : {
				banner : '/*<%= pkg.name %> <%= grunt.template.today("mm-dd-yyyy") %>*/\n',
				report : 'min'
			},
			minifyjs : {
				files : {
					'public/javascripts/app.min.js' : ['public/javascripts/*.js']
				}
			}
		},
		watch : {
			dev : {
				files : ['public/**'],
				tasks : ['concat']
			},
			rel : {
				files : ['public/**'],
				tasks : ['minify']
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-concurrent' );
	grunt.loadNpmTasks( 'grunt-contrib-csslint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-nodemon' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	grunt.registerTask( 'dev', [ 'clean', 'concat', 'concurrent' ] );
	grunt.registerTask( 'rel', [ 'clean', 'minify', 'concurrent' ] );
	grunt.registerTask( 'minify', [ 'clean', 'cssmin', 'uglify' ] );
};