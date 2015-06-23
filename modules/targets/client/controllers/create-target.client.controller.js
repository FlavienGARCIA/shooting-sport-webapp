'use strict';

// Target create controller
angular.module('targets').controller('TargetCreateController', ['$scope', '$stateParams', '$location', 'Authentication', 'Targets',
	function($scope, $stateParams, $location, Authentication, Targets) {
		$scope.bullets = [];
		$scope.score = 0;
		$scope.currentBulletScore = 0;
		$scope.bulletScores = [];
		$scope.meanScore = 0;
		$scope.maxScore = 0;
		$scope.inBlack = 0;
		$scope.bulletCount = 0;

		// Create new Target
		$scope.create = function() {
			// Create new Target object
			var target = new Targets({
				score: $scope.score + '/' + $scope.maxScore,
				meanScore: $scope.meanScore,
				flooredMeanScore: Math.floor($scope.meanScore),
				bulletCount: $scope.bulletCount,
				bullets: $scope.bullets,
				inBlack: $scope.inBlack,
				inBlackPerc: +($scope.inBlack * 100 / $scope.bulletCount).toFixed(1),
				dt: $scope.dt
			});

			// Redirect after save
			target.$save(function(response) {
				$location.path('targets');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// get clicked bullet position
		$scope.getBulletPosition = function(event, container) {
			var currentMousePos = {
					x: -1,
					y: -1
				},
				parentOffset = container.offset();

			currentMousePos.x = (event.pageX - parentOffset.left) / container.width() * 100 + '%';
			currentMousePos.y = (event.pageY - parentOffset.top) / container.width() * 100 + '%';

			return currentMousePos;
		};

		// create bullet with clicked bullet position
		$scope.createBulletHole = function(event) {
			var container = $('.target'),
				currentScore = angular.element(event.target).attr('data-score'),
				isInBlack = angular.element(event.target).hasClass('black'),
				bulletsContainer = $('.bullets'),
				position = $scope.getBulletPosition(event, container),
				bullet = $('<div class="bullet nine-mm"></div>')
				.css({
					left: position.x,
					top: position.y
				})
				.attr('data-bullet-score', currentScore);

			bulletsContainer.prepend(bullet);

			$scope.bullets.push({
				x: position.x,
				y: position.y,
				score: currentScore
			});
			$scope.updateData(currentScore, isInBlack);
		};

		$scope.updateData = function(currentScore, isInBlack) {
			$scope.bulletCount++;
			if (isInBlack) $scope.inBlack++;

			$scope.currentBulletScore = parseInt(currentScore);
			$scope.score += $scope.currentBulletScore;
			$scope.bulletScores.push($scope.currentBulletScore);
			$scope.meanScore = +($scope.score / $scope.bulletCount).toFixed(2);
			$scope.maxScore = $scope.bulletCount * 10;
		};
	}
]);