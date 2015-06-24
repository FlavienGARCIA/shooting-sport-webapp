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
				'public/lib/angular-ui-select/dist/select.css'
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
				'public/lib/angular-ui-select/dist/select.js'

				// Materialism
				// 'public/themes/materialism/js/colors.js',

				// 'public/themes/materialism/js/app.js',
				// 'public/themes/materialism/js/app.constants.js',
				// 'public/themes/materialism/js/app.config.js',
				// 'public/themes/materialism/js/app.filters.js',

				// 'public/themes/materialism/js/directives/formcontrol.js',
				// 'public/themes/materialism/js/directives/navbar-hover.js',
				// 'public/themes/materialism/js/directives/navbar-search.js',
				// 'public/themes/materialism/js/directives/noui-slider.js',
				// 'public/themes/materialism/js/directives/todo-widget.js',
				// 'public/themes/materialism/js/directives/menu-link.js',
				// 'public/themes/materialism/js/directives/menu-toggle.js',
				// 'public/themes/materialism/js/directives/vectormap.js',
				// 'public/themes/materialism/js/directives/autofocus.js',
				// 'public/themes/materialism/js/directives/card-flip.js',
				// 'public/themes/materialism/js/directives/scroll-spy.js',

				// 'public/themes/materialism/js/services/color-service.js',
				// 'public/themes/materialism/js/services/todo-service.js',

				// 'public/themes/materialism/js/controllers/main.js',
				// 'public/themes/materialism/js/controllers/dashboard.js',
				// 'public/themes/materialism/js/controllers/charts.js',
				// 'public/themes/materialism/js/controllers/colors.js',
				// 'public/themes/materialism/js/controllers/lists.js',
				// 'public/themes/materialism/js/controllers/maps/full-map.js',
				// 'public/themes/materialism/js/controllers/maps/basic-map.js',
				// 'public/themes/materialism/js/controllers/maps/clickable-map.js',
				// 'public/themes/materialism/js/controllers/maps/searchable-map.js',
				// 'public/themes/materialism/js/controllers/maps/zoomable-map.js',
				// 'public/themes/materialism/js/controllers/maps/vector-map.js',
				// 'public/themes/materialism/js/controllers/forms.js',
				// 'public/themes/materialism/js/controllers/upload.js',
				// 'public/themes/materialism/js/controllers/tables/basic.js',
				// 'public/themes/materialism/js/controllers/tables/data.js',
				// 'public/themes/materialism/js/controllers/apps/crud.js',
				// 'public/themes/materialism/js/controllers/apps/todo.js'
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
