'use strict';

// Targets controller
angular.module('targets').controller('TargetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Targets',
	function($scope, $stateParams, $location, Authentication, Targets ) {
		$scope.authentication = Authentication;

		// Create new Target
		$scope.create = function() {
			// Create new Target object
			var target = new Targets ({
				score: this.data.score.score + '/' + this.data.score.maxScore,
				meanScore: this.data.score.meanScore,
				bulletCount: this.data.bullet.bulletCount,
				bullets: this.bullets
			});

			// Redirect after save
			target.$save(function(response) {
				$location.path('targets/' + response._id);
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
				$location.path('targets/' + target._id);
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

		$scope.data = {
			score : {
				score: 0,
				currentBulletScore: 0,
				bulletScores: [],
				meanScore: 0,
				maxScore: 0,
				inBlack: 0,
				inWhite: 0
			},
			bullet : {
				bulletCount: 0,
			},
			ammo: {
				SB124: 'Sellier & Belliot 124g',
				CCI: 'CCI Standard Velocity'
			},
			weapon: {
				czShadow: 'CZ 75 SP-01 Shadow',
				beretta92s: 'Beretta 92S',
				buck: 'Browning Buck Mark URX',
				beretta76: 'Beretta 76',
				caliber: {
					'9mm': '9mm',
					'.22': '.22',
					'4.5': '4.5'
				}
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
			$scope.data.bullet.bulletCount++;

			$scope.data.score.currentBulletScore = parseInt(currentScore);
			$scope.data.score.score += $scope.data.score.currentBulletScore;
			$scope.data.score.bulletScores.push($scope.data.score.currentBulletScore);
			$scope.data.score.meanScore = +($scope.data.score.score / $scope.data.bullet.bulletCount).toFixed(2);
			$scope.data.score.maxScore = $scope.data.bullet.bulletCount * 10;

			this.textData[0].value = $scope.data.score.score + '/' + $scope.data.score.maxScore;
			this.textData[1].value = $scope.data.score.meanScore;
			this.textData[2].value = $scope.data.bullet.bulletCount;
		};

		$scope.textData = [
			{
				label: 'Score',
				value: $scope.data.score.score + '/' + $scope.data.score.maxScore
			},
			{
				label: 'Score moyen',
				value: $scope.data.score.meanScore
			},
			{
				label: 'Impacts',
				value: $scope.data.bullet.bulletCount
			}
		];
	}
]);