/*
 * grunt-jsonschema-amd-restclient-generator
 * https://github.com/geobricks/grunt-jsonschema-amd-restclient-generator
 *
 * Copyright (c) 2015 Guido Barbaglia
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.registerMultiTask('jsonschema_amd_restclient_generator', function() {

        /* Merge options. */
        var options = this.options({});

        /* Make the options global. */
        grunt.option('base_url', options.base_url);
        grunt.option('output_name', options.output_name);

        /* Configure Curl and download the JSON Schema. */
        grunt.initConfig({
            curl: {
                'resources/json/schema.json': options.base_url
            }
        });
        grunt.loadNpmTasks('grunt-curl');
        grunt.task.run('curl');

        /* Specify the next task to run. */
        grunt.task.run('generate_client');

    });

    /* Register task. */
    grunt.registerTask('generate_client', 'Generate an AMD client for REST web services described by a JSON Schema.', function () {

        /* Merge options. */
        var options = this.options({});

        /* Load required libraries. */
        var Handlebars = require('handlebars');
        var $ = require('jquery');

        /* Load JSON Schema. */
        var schema = grunt.file.readJSON('resources/json/schema.json');

        /* For each link in links -> create method. */
        var methods = [];
        var method_source = grunt.file.read('src/html/method.hbs', [, {encoding: 'utf8'}]);
        var method_template = Handlebars.compile(method_source);
        for (var i = 0 ; i < schema.links.length ; i++) {

            /* Store current service description. */
            var l = schema.links[i];

            /* Generate method signature. */
            var parameters = '';
            for (var j = 0 ; j < Object.keys(l.schema.properties).length ; j++) {
                parameters += Object.keys(l.schema.properties)[j];
                if (j < Object.keys(l.schema.properties).length - 1)
                    parameters += ', ';
            }

            /* Generate query parameters object. */
            var path_parameters = get_path_parameters(l.href);
            var data = [];
            for (j = 0 ; j < Object.keys(l.schema.properties).length ; j++) {
                var o = Object.keys(l.schema.properties)[j];
                if (path_parameters.indexOf(Object.keys(l.schema.properties)[j]) < 0) {
                    data.push(o);
                }
            }
            var data_source = grunt.file.read('src/html/data.hbs', [, {
                encoding: 'utf8'
            }]);
            var data_template = Handlebars.compile(data_source);
            var data_dynamic_data = {
                data: data
            };
            var data_html = data_template(data_dynamic_data);

            /* Generate the method. */
            var method_dynamic_data = {
                url: '\'' + inject_params(grunt.option('base_url'), l.href, l.schema.properties, schema.definitions) + '\'',
                method: '\'' + l.method.toString().toUpperCase() + '\'',
                rel: l.rel,
                parameters: parameters,
                data: data_html
            };
            methods.push(method_template(method_dynamic_data));

        }

        /* Load Handlebars template for tiles. */
        var source = grunt.file.read('src/html/archetype.hbs', [, {
            encoding: 'utf8'
        }]);
        var template = Handlebars.compile(source);
        var dynamic_data = {
            methods: methods,
            validators: 'validators'
        };
        var html = template(dynamic_data);

        /* Write the file. */
        grunt.file.write('tmp/' + grunt.option('output_name') + '.js', template(dynamic_data), [, {encoding: 'utf8'}]);

        /* Specify the next task to run. */
        grunt.task.run('minify_client');

    });

    grunt.registerTask('minify_client', 'Generate an AMD client for REST web services described by a JSON Schema.', function () {
        var dist = 'dist/' + grunt.option('output_name') + '.min.js';
        var uglify = {};
        uglify.target = {};
        uglify.target.files = {};
        uglify.target.files['dist/' + grunt.option('output_name') + '.min.js'] = ['tmp/' + grunt.option('output_name') + '.js'];
        grunt.initConfig({
            uglify: uglify
        });
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.task.run('uglify');
    });

    /* Inject parameters in the URL. */
    var inject_params = function(base_url, href, properties, definitions) {
        var final_url = base_url + href;
        for (var i = 0 ; i < href.length ; i++) {
            var start, end = null;
            if (href.charAt(i) == '{') start = i;
            if (href.charAt(i) == '}') end   = i;
            if (start != null && end != null) {
                var param = href.substring(1 + start, end);
                final_url = final_url.replace(href.substring(start, 1 + end), '\' + ' + param + ' + \'');
                start = null;
                end = null;
            }
        }
        return final_url;
    };

    /* Get the list of path parameters, if any. */
    var get_path_parameters = function(href) {
        var out = [];
        for (var i = 0 ; i < href.length ; i++) {
            var start, end = null;
            if (href.charAt(i) == '{') start = i;
            if (href.charAt(i) == '}') end = i;
            if (start != null && end != null) {
                out.push(href.substring(1 + start, end));
                start = null;
                end = null;
            }
        }
        return out;
    }

};
