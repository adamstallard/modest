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
        src : ['test/ModestCompilerTests.js'],
        options : {
          disabled : false
        }
      }
    }
  });

  // npm tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-vows-runner');

  // default task
  grunt.registerTask('default', ['jshint', 'vows']);

};