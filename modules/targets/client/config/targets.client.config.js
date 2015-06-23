'use strict';

// Configuring the Targets module
angular.module('targets').run(['Menus',
	function(Menus) {

		Menus.addMenuItem('topbar', {
			title: 'Statistiques',
			state: 'targets.stats'
		});
	}
]);