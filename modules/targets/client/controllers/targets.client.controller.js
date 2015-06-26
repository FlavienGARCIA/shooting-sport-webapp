'use strict';

// Targets controller
angular.module('targets').controller('TargetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Targets', '$modal', '$log', 'ngTableParams', '$filter',
	function($scope, $stateParams, $location, Authentication, Targets, $modal, $log, ngTableParams, $filter) {
		$scope.authentication = Authentication;

		// Find a list of Targets
		$scope.find = function() {
			$scope.targets = Targets.query(function(data) {
		        $scope.tableParams = new ngTableParams({
		            page: 1,            // show first page
		            count: 10,          // count per page
		            sorting: {
			            dt: 'desc'     // initial sorting
			        }
		        }, {
		        	filterDelay: 0,
					total: data.length, // length of data
					getData: function($defer, params) {
						var searchStr = params.filter().search;
						var mydata = [];

						if (searchStr) {
							searchStr = searchStr.toLowerCase();
							mydata = data.filter(function(item) {
								return item.user.displayName.toLowerCase().indexOf(searchStr) > -1;
							});

						} else {
							mydata = data;
						}

						mydata = params.sorting() ? $filter('orderBy')(mydata, params.orderBy()) : mydata;
						$defer.resolve(mydata.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
		        });
			});
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