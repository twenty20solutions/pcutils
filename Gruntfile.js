/* global module:false */
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    eslint: {
      options: {
        format: 'codeframe',
        fix: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
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
        tasks: ['eslint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['eslint:lib_test', 'mochaTest']
      },
      default: {
        files: 'lib/*.js',
        tasks: ['eslint']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-coveralls');

  // testing
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
  // Default task.
  grunt.registerTask('default', ['eslint', 'test']);


};
