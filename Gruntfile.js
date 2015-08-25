/*
 * grunt-jsonschema-amd-restclient-generator
 * https://github.com/geobricks/grunt-jsonschema-amd-restclient-generator
 *
 * Copyright (c) 2015 Guido Barbaglia
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    //jshint: {
    //  all: [
    //    'Gruntfile.js',
    //    'tasks/*.js',
    //    '<%= nodeunit.tests %>'
    //  ],
    //  options: {
    //    jshintrc: '.jshintrc'
    //  }
    //},
    //
    //// Before generating any new files, remove any previously-created files.
    //clean: {
    //  tests: ['tmp']
    //},

    // Configuration to be run (and then tested).
    jsonschema_amd_restclient_generator: {
      custom_options: {
        options: {
          base_url: 'http://localhost:8080/faostat-api/v1.0/',
          output_name: 'faostat-api'
        }
      }
    }

    // Unit tests.
    //nodeunit: {
    //  tests: ['test/*_test.js']
    //}

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-clean');


  /* Test task. */
  grunt.registerTask('default', ['jsonschema_amd_restclient_generator']);

};
