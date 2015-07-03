'use strict';

angular.module('targets')
	.value('Helpers', [{
			name: 'uploadImage',
			state: 1,
			done: true,
			buttonText: 'Parcourir',
			function: '',
			text: 'Commencez par ajouter une photo de votre cible.'
		}, {
			name: 'moveImage',
			state: 2,
			done: true,
			buttonText: 'Valider',
			function: '',
			text: 'Ajustez le noir de la cible de l\'image sur le rouge de la cible virtuelle jusqu\'à ce qu\'elles soient alignées.'
		}, {
			name: 'createImpacts',
			state: 3,
			done: false,
			buttonText: 'Valider',
			function: '',
			text: 'Cliquez le plus précisément possible sur les impacts de votre photo pour les enregistrer.'
		}, {
			name: 'creation',
			state: 4,
			done: true,
			buttonText: 'Enregistrer la cible',
			function: '',
			text: 'Vérifiez vos impacts et votre score. Choisissez la date de votre cible et enregistrez-là (par défaut la date d\'aujourd\'hui).'
		}])
    .directive('helper', function ($timeout, Helpers) {
        return {
            restrict: 'EA',
            templateUrl: '../views/helper.client.view.html',
            scope: {
                state: '=',
                text: '='
            },
            link: function ($scope, element, attr) {

                $scope.helpers = Helpers;

                // $scope.remove = function (field) {
                //     delete $scope.record[field];
                //     $scope.blurUpdate();
                // };
                
                // $scope.blurUpdate = function () {
                //     if ($scope.live !== 'false') {
                //         $scope.record.$update(function (updatedRecord) {
                //             $scope.record = updatedRecord;
                //         });
                //     }
                // };
                // var saveTimeout;
                // $scope.update = function () {
                //     $timeout.cancel(saveTimeout);
                //     saveTimeout = $timeout($scope.blurUpdate, 1000);
                // };
            }
        };
    });