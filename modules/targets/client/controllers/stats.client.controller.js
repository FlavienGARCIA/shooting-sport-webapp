'use strict';

// Targets stats controller
angular.module('targets').controller('TargetsStatsController', ['$scope', 'Targets',
	function($scope, Targets) {
		$scope.globalMeanScore = 0;
		$scope.globalInBlackPerc = 0;
		
		$scope.meanScorePoints = [];
		$scope.meanScoreColumns = [{
			'id': 'Score moyen',
			'type': 'area'
		}];

		$scope.inBlackPoints = [];
		$scope.inBlackColumns = [{
			'id': 'Pourcentage dans noir',
			'type': 'area'
		}];

		$scope.datax = {
			'id': 'x'
		};

		// Find a list of Targets
		$scope.targets = Targets.query(function(data) {
			$scope.updateStats(data);
		});

		$scope.updateStats = function(data) {
			data.forEach(function(item, index) {

				// push data in meanScore charts array
				$scope.meanScorePoints.push({
					'x': Date.parse(item.dt),
					'Score moyen': item.meanScore
				});

				// push data in inBlack charts array
				$scope.inBlackPoints.push({
					'x': Date.parse(item.dt),
					'Pourcentage dans noir': item.inBlackPerc
				});

				$scope.globalMeanScore += item.meanScore;
				$scope.globalInBlackPerc += item.inBlackPerc;
			});

			$scope.globalMeanScore = +($scope.globalMeanScore / data.length).toFixed(2);
			$scope.globalInBlackPerc = +($scope.globalInBlackPerc / data.length).toFixed(2);
		};
	}
]);