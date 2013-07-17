'use strict';

module.exports = function(grunt) {

  // project configuration
  grunt.initConfig({
    jshint : {
      all : {
        src : [
          "*.js",
          "bin/**/*.js",
          "lib/**/*.js",
          "test/**/*.js"
        ]
      },
      options : {
        jshintrc : ".jshintrc"
      }
    },
    vows : {
      options : {
        reporter : "spec"
      },
      compiler : {
        src : ['test/CompilerTest.js']
      },
      commandLine : {
        src : ['test/CommandLineTest.js']
      },
      parallel : {
        src : ['test/ParallelTest.js']
      },
      serial : {
        src : ['test/SerialTest.js']
      }
    }
  });

  // npm tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-vows-runner');

  // default task
  grunt.registerTask('default', ['jshint', 'vows']);

};