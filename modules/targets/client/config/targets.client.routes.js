'use strict';

//Setting up route
angular.module('targets').config(['$stateProvider',
	function($stateProvider) {
		// Targets state routing
		$stateProvider.
		state('targets', {
			abstract: true,
			url: '/targets',
			template: '<ui-view/>'
		}).
		state('targets.list', {
			url: '',
			templateUrl: 'modules/targets/views/list-targets.client.view.html'
		}).
		state('targets.create', {
			url: '/create',
			templateUrl: 'modules/targets/views/create-target.client.view.html'
		}).
		state('targets.edit', {
			url: '/:targetId/edit',
			templateUrl: 'modules/targets/views/edit-target.client.view.html'
		}).
		state('targets.stats', {
			url: '/stats',
			templateUrl: 'modules/targets/views/stats.client.view.html'
		});
	}
]);