'use strict';

angular.module('targets').controller('TargetHelperController', ['$scope', '$stateParams', '$location', 'Authentication', 'Targets', 
	function($scope, $stateParams, $location, Authentication, Targets) {

		$scope.helpers = [{
			name: 'uploadImage',
			done: true,
			buttonText: 'Parcourir',
			action: function() {
				angular.element('#upload-image input').trigger('click');
			},
			text: 'Commencez par ajouter une photo de votre cible.'
		}, {
			name: 'moveImage',
			done: true,
			buttonText: 'Valider',
			action: function() {
				$scope.$parent.setImpactsMode();
			},
			text: 'Ajustez le noir de la cible de l\'image sur le rouge de la cible virtuelle jusqu\'à ce qu\'elles soient alignées.'
		}, {
			name: 'createImpacts',
			done: $scope.$parent.impactsModeDone,
			buttonText: 'Valider',
			action: function() {
				$scope.$parent.setVisualisationMode();
			},
			text: 'Cliquez le plus précisément possible sur les impacts de votre photo pour les enregistrer.'
		}, {
			name: 'creation',
			done: true,
			buttonText: 'Enregistrer la cible',
			action: function() {
				$scope.$parent.create();
			},
			text: 'Vérifiez vos impacts et votre score. Choisissez la date de votre cible et enregistrez-là (par défaut la date d\'aujourd\'hui).'
		}];

		$scope.helpers.forEach(function(value, index) {
			value.state = index +1;
		});

		$scope.setCurrentHelperState = function(state) {
			$scope.$parent.currentHelperState = state;
		};
	}
]);