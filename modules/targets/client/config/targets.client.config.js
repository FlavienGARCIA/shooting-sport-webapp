'use strict';

// Configuring the Targets module
angular.module('targets').run(['Menus',
	function(Menus) {
		// Add the dropdown create item
		Menus.addMenuItem('topbar', {
			title: 'Nouvelle cible',
			state: 'targets.create'
		});
		
		// Add the dropdown list item
		Menus.addMenuItem('topbar', {
			title: 'Mes cibles',
			state: 'targets.list'
		});
	}
]);