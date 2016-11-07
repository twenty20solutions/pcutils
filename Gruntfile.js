/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      // http://jshint.com/docs/options
      options: {
        "jshintrc": true,
        force: false
      },
      gruntfile: {
        jshintrc: true,
        src: 'Gruntfile.js'
      },
      lib_test: {
        options: {
          jshintrc: true
        },
        src: ['lib/*.js', 'test/*.spec.js']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: 5000
        },
        src: ['test/*.spec.js']
      }
    },
    mocha_istanbul: {
      coverage: {
        options: {
          reporter: 'spec',
          timeout: 5000
        },
        src: ['test/*.spec.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'mochaTest']
      },
      default: {
        files: 'lib/*.js',
        tasks: ['jshint']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-coveralls');

  //testing
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
  // Default task.
  grunt.registerTask('default', ['jshint', 'test']);


};
