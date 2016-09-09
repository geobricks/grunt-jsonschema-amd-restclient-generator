/*
 * grunt-jsonschema-amd-restclient-generator
 * https://github.com/geobricks/grunt-jsonschema-amd-restclient-generator
 *
 * Copyright (c) 2015 Guido Barbaglia
 * Licensed under the MIT license.
 */

(function () {

    'use strict';

    /*global module*/
    module.exports = function (grunt) {

        /* Project configuration. */
        grunt.initConfig({

            /* Plugin configuration. */
            jsonschema_amd_restclient_generator: {
                custom_options: {
                    options: {
                        base_url: 'http://localhost:8081/faostat-api/v1/',
                        //base_url: 'http://fenix.fao.org:18300/api/v1/',
                        //base_url: 'http://fenixservices.fao.org/faostat/api/v1/',

                        /* Optional. final_base_url will the the final end point in the library */
                        /* if not set will be used base_url as end point */
                        /* TODO: should be in the schema? */
                       // final_base_url: 'http://fenixservices.fao.org/faostat/api/v1/',
                        final_base_url: 'http://fenixervices.fao.org/faostat/api/v1/',

                        output_name: 'RESTClient',
                        output_folder: 'src/js',
                        useQ: true,
                        useCache: true,
                        expiresTime: 100000
                    }
                }
            }

        });

        /* Actually load this plugin's task(s). */
        grunt.loadTasks('tasks');

        /* Test task. */
        grunt.registerTask('default', ['jsonschema_amd_restclient_generator']);

    };

}());
