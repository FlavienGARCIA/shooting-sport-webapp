'use strict';

// Targets controller
angular.module('targets').controller('TargetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Targets', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Targets, $modal, $log) {
		$scope.authentication = Authentication;
		$scope.predicate = 'dt';
		$scope.reverse = true;

		// Find a list of Targets
		$scope.targets = Targets.query();

		$scope.order = function(predicate) {
			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			$scope.predicate = predicate;
		};

		// Remove existing Target
		$scope.remove = function(target) {
			if (target) {
				target.$remove();

				for (var i in $scope.targets) {
					if ($scope.targets[i] === target) {
						$scope.targets.splice(i, 1);
					}
				}
			} else {
				$scope.target.$remove(function() {
					$location.path('targets');
				});
			}
		};

		// Open update modal function
		$scope.animationsEnabled = true;

		$scope.openUpdateModal = function(selectedTarget) {

			var modalInstance = $modal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'modules/targets/views/edit-target.client.view.html',
				controller: function ($scope, $modalInstance, target) {
					$scope.target = target;
				},
				size: 'lg',
				resolve: {
					target: function() {
						return selectedTarget;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.selected = selectedItem;
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.toggleAnimation = function() {
			$scope.animationsEnabled = !$scope.animationsEnabled;
		};

		// Update existing Target
		$scope.update = function() {
			var target = $scope.target;

			target.$update(function() {
				$location.path('targets');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Target
		$scope.findOne = function() {
			$scope.target = Targets.get({
				targetId: $stateParams.targetId
			});
		};
	}
]);