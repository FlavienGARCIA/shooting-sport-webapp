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
		$scope.uploader = null;
		
		$scope.cropEnabled = true;
		$scope.cropContainer = $('.imageContainer > img');
		$scope.cropData = null;
		$scope.currentHelperState = 0;

		$scope.imageMode = false;
		$scope.impactsMode = false;
		$scope.verificationMode = false;

		$scope.helpers = [{
			done: true,
			name: 'uploadImage',
			buttonText: 'Parcourir',
			icon: '',
			text: 'Commencez par ajouter une photo de votre cible.',
			action: function() {
				$scope.initCropper();
				$scope.setFlags();
				$scope.imageMode = true;
				$scope.currentHelperState = 1;
			}
		}, {
			done: true,
			name: 'setImpactsMode',
			buttonText: 'Suivant',
			icon: '',
			text: 'Ajustez le noir de la cible de l\'image sur le rouge de la cible virtuelle jusqu\'à ce qu\'elles soient alignées.',
			previousAction: function() {
				$scope.clickUploadButton();
			},
			action: function() {
				$scope.setImpactsMode();
			}
		}, {
			done: false,
			name: 'setVerificationMode',
			buttonText: 'Suivant',
			icon: '',
			text: 'Cliquez précisément sur les impacts de votre photo pour les enregistrer.',
			previousAction: function() {
				$scope.setImageMode();
			},
			action: function() {
				$scope.setVerificationMode();
			}
		}, {
			done: true,
			name: 'create',
			buttonText: 'Enregistrer la cible',
			icon: '',
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
			$scope.setFlags();
			$scope.currentHelperState = 0;
		};

		$scope.setImageMode = function() {
			$scope.enableCrop();
			$scope.setFlags();
			$scope.imageMode = true;
			$scope.currentHelperState = 1;
		};

		$scope.setImpactsMode = function() {
			$scope.disableCrop();
			$scope.setFlags();
			$scope.impactsMode = true;
			$scope.currentHelperState = 2;
		};

		$scope.setVerificationMode = function() {
			$scope.disableCrop();
			$scope.setFlags();
			$scope.verificationMode = true;
			$scope.currentHelperState = 3;
		};
		
		$scope.setFlags = function() {
			$scope.imageMode = false;
			$scope.impactsMode = false;
			$scope.verificationMode = false;
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
			$scope.cropEnabled = true;
		};

		$scope.disableCrop = function() {
			$scope.cropContainer.cropper('disable');
			$scope.cropEnabled = false;
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