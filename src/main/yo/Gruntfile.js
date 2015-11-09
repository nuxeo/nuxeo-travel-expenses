'use strict';
var LIVERELOAD_PORT = 35729;
var mountFolder = function (dir) {
  return require('serve-static')(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: '../../../target/classes/web/nuxeo.war/travel-expenses'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true,
        livereload: { liveCSS: false }
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= yeoman.app %>/*.html',
          '<%= yeoman.app %>/elements/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/elements/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint']
      },
      styles: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.css',
          '<%= yeoman.app %>/elements/{,*/}*.css'
        ],
        tasks: ['copy:styles', 'autoprefixer:server']
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      server: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: '**/*.css',
          dest: '.tmp'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['**/*.css', '!bower_components/**/*.css'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      proxies: [
        {
          context: '/nuxeo',
          host: 'localhost',
          port: 8080
        }
      ],
      livereload: {
        options: {
          middleware: function () {
            return [
              require('grunt-connect-proxy/lib/utils').proxyRequest,
              require('connect-livereload')({port: LIVERELOAD_PORT}),
              mountFolder('.tmp'),
              mountFolder(yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: {
            target: 'http://localhost:<%= connect.options.port %>/test'
          },
          middleware: function () {
            return [
              mountFolder('.tmp'),
              mountFolder(yeomanConfig.app)
            ];
          },
          keepalive: true
        }
      },
      dist: {
        options: {
          middleware: function () {
            return [
              mountFolder(yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: ['.tmp', '<%= yeoman.dist %>/*'],
      server: '.tmp',
      options: { force: true }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>'],
        blockReplacements: {
          vulcanized: function (block) {
            return '<link rel="import" href="' + block.dest + '">';
          }
        }
      }
    },
    vulcanize: {
      default: {
        options: {
          inlineScripts: true,
          inlineCss: true
        },
        files: {
          '<%= yeoman.dist %>/elements/elements.vulcanized.html': [
            '<%= yeoman.app %>/elements/elements.html'
          ]
        }
      }
    },
    cssmin: {
      main: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '.tmp/concat/styles/{,*/}*.css'
          ]
        }
      },
      elements: {
        files: [{
          expand: true,
          cwd: '.tmp/elements',
          src: '{,*/}*.css',
          dest: '<%= yeoman.dist %>/elements'
        }]
      }
    },
    minifyHtml: {
      options: {
        quotes: true,
        empty: true,
        spare: true
      },
      app: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            '*.html',
            'elements/**',
            '!elements/**/*.css',
            'images/{,*/}*.{png,webp,gif}'
          ]
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '.tmp',
          src: ['{styles,elements}/{,*/}*.css']
        }]
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'copy:styles',
      'configureProxies',
      'autoprefixer:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'copy',
    'useminPrepare',
    'concat',
    'autoprefixer',
    'uglify',
    'cssmin',
    'vulcanize',
    'usemin',
    'minifyHtml'
  ]);

  grunt.registerTask('default', [
    'jshint',
    // 'test'
    'build'
  ]);
};
