'use strict';

// Configuring the Targets module
angular.module('targets').run(['Menus',
	function(Menus) {
		// Add the Targets dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Targets',
			state: 'targets',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'targets', {
			title: 'List Targets',
			state: 'targets.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'targets', {
			title: 'Create Target',
			state: 'targets.create'
		});
	}
]);