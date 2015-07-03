'use strict';

angular.module('targets').controller('TargetHelperController', ['$scope', '$stateParams', '$location', 'Authentication', 'Targets', 
	function($scope, $stateParams, $location, Authentication, Targets) {

		$scope.helpers = [{
			done: true,
			name: 'uploadImage',
			buttonText: 'Parcourir',
			text: 'Commencez par ajouter une photo de votre cible.',
			action: function() {
				$scope.$parent.initCropper();
				$scope.$parent.setFlags();
				$scope.$parent.imageMode = true;
				$scope.$parent.currentHelperState = 1;
			}
		}, {
			done: true,
			name: 'setImpactsMode',
			buttonText: 'Valider',
			text: 'Ajustez le noir de la cible de l\'image sur le rouge de la cible virtuelle jusqu\'à ce qu\'elles soient alignées.',
			previousAction: function() {
				$scope.clickUploadButton();
			},
			action: function() {
				$scope.$parent.setImpactsMode();
			}
		}, {
			done: false,
			name: 'setVerificationMode',
			buttonText: 'Valider',
			text: 'Cliquez précisément sur les impacts de votre photo pour les enregistrer.',
			previousAction: function() {
				$scope.$parent.setImageMode();
			},
			action: function() {
				$scope.$parent.setVerificationMode();
			}
		}, {
			done: true,
			name: 'create',
			buttonText: 'Enregistrer la cible',
			text: 'Vérifiez vos impacts et votre score. Choisissez la date de votre cible et enregistrez-là (par défaut aujourd\'hui).',
			previousAction: function() {
				$scope.$parent.setImpactsMode();
			},
			action: function() {
				$scope.$parent.create();
			}
		}];

		$scope.helpers.forEach(function(value, index) {
			value.state = index;
		});

		$scope.clickUploadButton = function() {
			angular.element('#upload-image input').trigger('click');
			$scope.$parent.setFlags();
			$scope.$parent.currentHelperState = 0;
		};
	}
]);