'use strict';

//Targets service used to communicate Targets REST endpoints
angular.module('targets').factory('Targets', ['$resource',
	function($resource) {
		return $resource('api/targets/:targetId', { targetId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);