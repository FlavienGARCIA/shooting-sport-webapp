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
		$scope.inBlackPerc = 0;
		$scope.bulletCount = 0;
		$scope.scoreText = $scope.score + '/' + $scope.maxScore;

		$scope.weapons = ['CZ 75 SP-01 Shadow', 'Beretta 92S', 'Browning Buck Mark URX', 'Beretta 76'];
		$scope.calibers = [
			{name:'9x19mm', class: 'nine-mm'},
			{name: '.22 LR', class: 'twenty-two-lr'}
		];
		$scope.ammos = ['Sellier & Belliot', 'CCI Standard Velocity'];
		$scope.distances = ['10m', '25m'];

		$scope.imageURL = '';
		$scope.cropContainer = $('.imageContainer > img');
		$scope.currentHelperState = 0;

		$scope.resetData = function() {
			$scope.bullets = [];
			$scope.score = 0;
			$scope.scoreText = '';
			$scope.currentBulletScore = 0;
			$scope.bulletScores = [];
			$scope.meanScore = 0;
			$scope.maxScore = 0;
			$scope.bulletCount = 0;
			$scope.inBlack = 0;
			$scope.inBlackPerc = 0;
			$scope.cropParams = {
				opacity: 100,
				rotation: 0,
				zoom: 100,
				x: 0,
				y: 0
			};
			$('.bullets').html('');
			$scope.helpers[2].done = false;
			$scope.success = false;
		};

		$scope.setCurrentStateByName = function(name) {
 
			for (var i = 0; i < $scope.helpers.length; i++) {

				if ($scope.helpers[i].name === name) {
					$scope.currentHelperState = i;
				}
			}

			return null;
		};

		$scope.checkCurrentStateByName = function(name) {
			for (var i = 0; i < $scope.helpers.length; i++) {

				if ($scope.helpers[i].name === name) {
					if(i === $scope.currentHelperState) return true;
				}
			}

			return null;
		};

		$scope.helpers = [{
			done: true,
			name: 'upload',
			buttonText: 'Parcourir',
			icon: 'file_upload',
			text: 'Commencez par ajouter une photo de votre cible.',
			action: function() {
				$scope.initCropper();
				$scope.setCurrentStateByName('image');
			}
		}, {
			done: true,
			name: 'image',
			buttonText: 'Suivant',
			icon: 'navigate_next',
			text: 'Ajustez le noir de la cible de l\'image sur le rouge de la cible virtuelle jusqu\'à ce qu\'elles soient alignées.',
			previousAction: function() {
				$scope.clickUploadButton();
				$scope.destroyCrop();
			},
			action: function() {
				$scope.setImpactsMode();
			}
		}, {
			done: false,
			name: 'impacts',
			buttonText: 'Suivant',
			icon: 'navigate_next',
			text: 'Cliquez précisément sur les impacts de votre photo pour les enregistrer.',
			previousAction: function() {
				$scope.setImageMode();
			},
			action: function() {
				$scope.setVerificationMode();
			}
		}, {
			done: true,
			name: 'verification',
			buttonText: 'Enregistrer la cible',
			icon: 'save',
			text: 'Vérifiez vos impacts et votre score. Choisissez la date de votre cible et enregistrez-là (par défaut aujourd\'hui).',
			previousAction: function() {
				$scope.setImpactsMode();
			},
			action: function() {
				$scope.create();
			}
		}];

		$scope.helpers.forEach(function(value, index) {
			value.state = index;
		});

		$scope.clickUploadButton = function() {
			angular.element('#upload-image input').trigger('click');
			$scope.setCurrentStateByName('upload');
		};

		$scope.setImageMode = function() {
			$scope.enableCrop();
			$scope.setCurrentStateByName('image');
		};

		$scope.setImpactsMode = function() {
			$scope.disableCrop();
			$scope.setCurrentStateByName('impacts');
		};

		$scope.setVerificationMode = function() {
			$scope.disableCrop();
			$scope.setCurrentStateByName('verification');
		};

		$scope.cropParams = {
			opacity: 100,
			rotation: 0,
			zoom: 100,
			x: 0,
			y: 0
		};

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

		$scope.rotateCrop = function(clockwise) {
			if(clockwise) {
				$scope.cropContainer.cropper('rotate', 5);
				$scope.cropParams.rotation += 5;
			} else {
				$scope.cropContainer.cropper('rotate', -5);
				$scope.cropParams.rotation -= 5;
			}
		};

		$scope.zoomCrop = function(zoomIn) {
			if(zoomIn) {
				$scope.cropContainer.cropper('zoom', 0.005);
			} else {
				$scope.cropContainer.cropper('zoom', -0.005);
			}
		};

		$scope.moveCrop = function(x, direction) {
			if(x) {
				if(direction) {
					$scope.cropContainer.cropper('move', 1, 0);
				} else {
					$scope.cropContainer.cropper('move', -1, 0);
				}
			} else {
				if(direction) {
					$scope.cropContainer.cropper('move', 0, 1);
				} else {
					$scope.cropContainer.cropper('move', 0, -1);
				}
			}
		};

		$scope.resetCrop = function() {
			$scope.cropContainer.cropper('reset');

			$scope.cropParams = {
				opacity: 100,
				rotation: 0,
				zoom: 100,
				x: 0,
				y: 0
			};
		};

		$scope.enableCrop = function() {
			$scope.cropContainer.cropper('enable');
		};

		$scope.disableCrop = function() {
			$scope.cropContainer.cropper('disable');
		};

		$scope.destroyCrop = function() {
			$scope.resetData();
			$scope.cropContainer.cropper('destroy');
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

			$scope.helpers[2].done = true;
		};

		$scope.updateData = function(currentScore, isInBlack) {
			$scope.bulletCount++;
			if (isInBlack) $scope.inBlack++;

			$scope.currentBulletScore = parseInt(currentScore);
			$scope.score += $scope.currentBulletScore;
			$scope.bulletScores.push($scope.currentBulletScore);
			$scope.meanScore = +($scope.score / $scope.bulletCount).toFixed(2);
			$scope.maxScore = $scope.bulletCount * 10;
			$scope.scoreText = $scope.score + '/' + $scope.maxScore;
			$scope.inBlackPerc = +($scope.inBlack * 100 / $scope.bulletCount).toFixed(1);
		};

		// Create new Target
		$scope.create = function() {

			// Create new Target object
			var target = new Targets({
				score: $scope.scoreText,
				meanScore: $scope.meanScore,
				flooredMeanScore: Math.floor($scope.meanScore),
				bulletCount: $scope.bulletCount,
				bullets: $scope.bullets,
				inBlack: $scope.inBlack,
				inBlackPerc: $scope.inBlackPerc,
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