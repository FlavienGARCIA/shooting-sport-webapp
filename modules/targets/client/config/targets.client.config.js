'use strict';

// Configuring the Targets module
angular.module('targets').run(['Menus',
	function(Menus) {

		Menus.addMenuItem('topbar', {
			title: 'Tableau de bord',
			state: 'home',
			class: 'topbar-icon home'
		});

		Menus.addMenuItem('topbar', {
			title: 'Mes cibles',
			state: 'targets.list',
			class: 'topbar-icon list'
		});
		
		Menus.addMenuItem('topbar', {
			title: 'Nouvelle cible',
			state: 'targets.create',
			class: 'topbar-icon create'
		});

		Menus.addMenuItem('topbar', {
			title: 'Statistiques',
			state: 'targets.stats',
			class: 'topbar-icon stats'
		});
	}
]);