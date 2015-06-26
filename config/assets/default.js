'use strict';

module.exports = {
	client: {
		lib: {
			css: [
				// Materialism
				'public/themes/materialism/css/materialism.css',
				'public/themes/materialism/css/helpers.css',
				'public/themes/materialism/css/ripples.css',
				'public/lib/material-design-iconic-font/dist/css/material-design-iconic-font.css',
				'public/lib/c3/c3.css',
				'public/lib/angular-ui-select/dist/select.css',
				'public/lib/cropper/dist/cropper.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-route/angular-route.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-file-upload/angular-file-upload.js',
				'public/lib/d3/d3.js',
				'public/lib/c3/c3.js',
				'public/lib/c3-angular/c3js-directive.js',
				'public/lib/angular-ui-select/dist/select.js',
				'public/lib/nouislider/jquery.nouislider.js',
				'public/lib/nouislider/Link.js',
				'public/lib/angular-nouislider/src/nouislider.js',
				'public/lib/cropper/dist/cropper.js',
				'public/lib/ng-table/dist/ng-table.js'
			],
			tests: ['public/lib/angular-mocks/angular-mocks.js']
		},
		css: [
			'modules/*/client/css/*.css'
		],
		less: [
			'modules/*/client/less/*.less'
		],
		sass: [
			'modules/*/client/scss/*.scss'
		],
		js: [
			'modules/core/client/app/config.js',
			'modules/core/client/app/init.js',
			'modules/*/client/*.js',
			'modules/*/client/**/*.js'
		],
		views: ['modules/*/client/views/**/*.html']
	},
	server: {
		allJS: ['gulpfile.js', 'server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
		models: 'modules/*/server/models/**/*.js',
		routes: ['modules/*[!core]/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
		sockets: 'modules/*/server/sockets/**/*.js',
		config: 'modules/*/server/config/*.js',
		policies: 'modules/*/server/policies/*.js',
		views: 'modules/*/server/views/*.html'
	}
};
