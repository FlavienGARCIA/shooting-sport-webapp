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

		$scope.weapons = ['CZ 75 SP-01 Shadow', 'Beretta 92S', 'Browning Buck Mark URX', 'Beretta 76'];
		$scope.calibers = ['9x19mm', '.22 LR'];
		$scope.ammos = ['Sellier & Belliot', 'CCI Standard Velocity'];
		$scope.distances = ['10m', '25m'];

		$scope.imageURL = '';
		$scope.croppedImageURL = '';
		$scope.imageParams = {
			opacity: 100,
			rotation: 0,
			scale: 100,
			x: 0,
			y: 0
		};
		
		$scope.cropEnabled = true;
		$scope.cropContainer = $('.imageContainer > img');
		$scope.cropData = null;
		$scope.verificationMode = false;
		$scope.currentHelperState = 1;
		$scope.impactsModeDone = false;

		$scope.initCropper = function() {
			$scope.cropContainer.cropper({
				aspectRatio: 1 / 1,
				autoCropArea: 1,
				minCropBoxHeight: 1000,
				minCropBoxWidth: 1000,
				dragCrop: false,
				strict: false,
				cropBoxMovable: false,
				cropBoxResizable: false,
				background: false,
				modal: false,
				crop: function(data) {
					$scope.cropData = data;
				}
			});
		};

		$('.rotate').on({
			slide: function() {
				$('.cropper-canvas > img').css({
					// transform: 'translateY(300px) rotateZ(120deg)'
					transform: 'rotate(' + $scope.imageParams.rotation + 'deg)'
				});
			}
		});

		$scope.enableCrop = function() {
			$scope.cropContainer.cropper('enable');
			$scope.cropEnabled = true;
		};

		$scope.disableCrop = function() {
			$scope.cropContainer.cropper('disable');
			$scope.cropEnabled = false;
		};

		$scope.setImageMode = function() {
			$scope.enableCrop();
			$scope.currentHelperState = 2;
			$scope.verificationMode = false;
		};

		$scope.setImpactsMode = function() {
			$scope.disableCrop();
			$scope.currentHelperState = 3;
			$scope.verificationMode = false;
		};

		$scope.setVerificationMode = function() {
			$scope.disableCrop();
			$scope.currentHelperState = 4;
			$scope.verificationMode = true;
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

			$scope.impactsModeDone = true;
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
				dt: $scope.dt,
				distance: this.distance,
				weapon: this.weapon,
				caliber: this.caliber,
				ammo: this.ammo,
				imageURL: $scope.imageURL,
				cropData: {
					x: $scope.cropData.x,
					y: $scope.cropData.y,
					height: $scope.cropData.height,
					width: $scope.cropData.width,
					rotate: $scope.cropData.rotate
				}
			});

			// Redirect after save
			target.$save(function(response) {
				$location.path('targets');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);