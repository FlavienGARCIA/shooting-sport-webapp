'use strict';

// Targets controller
angular.module('targets').controller('TargetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Targets',
	function($scope, $stateParams, $location, Authentication, Targets ) {
		$scope.authentication = Authentication;

		$scope.score = {
			score: 0,
			currentBulletScore: 0,
			bulletScores: [],
			meanScore: 0,
			maxScore: 0,
			inBlack: 0,
			bulletCount: 0,
			globalMeanScore: 0,
			globalInBlack: 0
		};

		$scope.data = {
			ammo: {
				SB124: 'Sellier & Belliot 124g',
				CCI: 'CCI Standard Velocity'
			},
			weapon: {
				czShadow: 'CZ 75 SP-01 Shadow',
				beretta92s: 'Beretta 92S',
				buck: 'Browning Buck Mark URX',
				beretta76: 'Beretta 76'
			},
			caliber: {
				'9mm': '9mm',
				'.22': '.22',
				'4.5': '4.5'
			},
			distance: {
				'25m': '25m',
				'10m': '10m'
			},
			sightingPoint: {
				x: 0,
				y: 0
			}
		};

		$scope.bullets = [];
		$scope.meanScorePoints = [];
		$scope.datax={"id":"x"};
		$scope.meanScoreColumns = [
			{
				'id': 'Score moyen',
				'type': 'area'
			}
		];

		$scope.predicate = 'dt';
      	$scope.reverse = true;

		// Create new Target
		$scope.create = function() {
			// Create new Target object
			var target = new Targets ({
				score: this.score.score + '/' + this.score.maxScore,
				meanScore: this.score.meanScore,
				flooredMeanScore: Math.floor(this.score.meanScore),
				bulletCount: this.score.bulletCount,
				bullets: this.bullets,
				inBlack: this.score.inBlack,
				dt: this.dt
			});

			// Redirect after save
			target.$save(function(response) {
				$location.path('targets');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Target
		$scope.remove = function( target ) {
			if ( target ) { target.$remove();

				for (var i in $scope.targets ) {
					if ($scope.targets [i] === target ) {
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
			var target = $scope.target ;

			target.$update(function() {
				$location.path('targets');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Targets
		$scope.find = function() {
			$scope.targets = Targets.query();
		};

		// Find existing Target
		$scope.findOne = function() {
			$scope.target = Targets.get({ 
				targetId: $stateParams.targetId
			});
		};

		$scope.findStatsData = function() {
			$scope.targets = Targets.query(function(data) {
				data.forEach(function(item, index) {
					$scope.meanScorePoints.push({
						'x': Date.parse(item.dt),
						'Score moyen': item.meanScore
					});

					$scope.score.globalMeanScore += item.meanScore;
				});

				$scope.score.globalMeanScore /= data.length;
				console.log($scope.score.globalMeanScore);
			});
		};

		$scope.order = function(predicate) {
	        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
	        $scope.predicate = predicate;
		};

		// get clicked bullet position
		$scope.getBulletPosition = function(event, container) {
			var currentMousePos = { x: -1, y: -1 },
				parentOffset = container.offset();

			currentMousePos.x = (event.pageX - parentOffset.left) / container.width() * 100 + '%';
			currentMousePos.y = (event.pageY - parentOffset.top) / container.width() * 100 + '%';

			return currentMousePos;
		};

		// create bullet with clicked bullet position
		$scope.createBulletHole = function(event) {
			var container = $('.target'),
				currentScore = angular.element(event.target).attr('data-score'),
				bulletsContainer = $('.bullets'),
				position = this.getBulletPosition(event, container),
				bullet = $('<div class="bullet nine-mm"></div>')
						.css({
							left: position.x,
							top: position.y
						})
						.attr('data-bullet-score', currentScore);

			bulletsContainer.prepend(bullet);
			this.bullets.push({
				x: position.x,
				y: position.y,
				score: currentScore
			});
			this.updateData(currentScore);
		};


		$scope.updateData = function(currentScore) {
			$scope.score.bulletCount++;

			$scope.score.currentBulletScore = parseInt(currentScore);
			$scope.score.score += $scope.score.currentBulletScore;
			$scope.score.bulletScores.push($scope.score.currentBulletScore);
			$scope.score.meanScore = +($scope.score.score / $scope.score.bulletCount).toFixed(2);
			$scope.score.maxScore = $scope.score.bulletCount * 10;

			this.textData[0].value = $scope.score.score + '/' + $scope.score.maxScore;
			this.textData[1].value = $scope.score.meanScore;
			this.textData[2].value = $scope.score.bulletCount;
		};

		$scope.textData = [
			{
				label: 'Score',
				value: $scope.score.score + '/' + $scope.score.maxScore
			},
			{
				label: 'Score moyen',
				value: $scope.score.meanScore
			},
			{
				label: 'Impacts',
				value: $scope.score.bulletCount
			}
		];
	}
]);