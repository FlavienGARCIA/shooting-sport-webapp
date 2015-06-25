'use strict';

// Target create controller
angular.module('targets').controller('TargetCreateController', ['$scope', '$stateParams', '$location', 'Authentication', 'Targets', 'FileUploader', '$timeout', '$window',
	function($scope, $stateParams, $location, Authentication, Targets, FileUploader, $timeout, $window) {
		$scope.bullets = [];
		$scope.score = 0;
		$scope.currentBulletScore = 0;
		$scope.bulletScores = [];
		$scope.meanScore = 0;
		$scope.maxScore = 0;
		$scope.inBlack = 0;
		$scope.bulletCount = 0;
		$scope.imageURL = '';
		$scope.weapons = [
			{ name: 'CZ 75 SP-01 Shadow', caliber: '9x19mm' },
			{ name: 'Beretta 92S', caliber: '9x19mm' },
			{ name: 'Browning Buck Mark URX', caliber: '.22 LR' },
			{ name: 'Beretta 76', caliber: '.22 LR' }
		];
		$scope.ammos = ['Sellier & Belliot', 'CCI Standard Velocity'];
		$scope.distances = ['10m', '25m'];
		$scope.imageParams = {
			opacity: 50,
			rotation: 0
		}

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

		// Create file uploader instance
		$scope.uploader = new FileUploader({
			url: 'api/targets/picture'
		});

		// Set file uploader image filter
		$scope.uploader.filters.push({
			name: 'imageFilter',
			fn: function (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		// Called after the user selected a new picture file
		$scope.uploader.onAfterAddingFile = function (fileItem) {
			if ($window.FileReader) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = function (fileReaderEvent) {
					$timeout(function () {
						$scope.imageURL = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

		// Called after the user has successfully uploaded a new picture
		$scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
			// Show success message
			$scope.success = true;

			$scope.imageURL = response.imageUrl;

			// Clear upload buttons
			$scope.uploader.clearQueue();
		};

		// Called after the user has failed to uploaded a new picture
		$scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
			// Clear upload buttons
			$scope.uploader.clearQueue();

			// Show error message
			$scope.error = response.message;
		};

		// Change user profile picture
		$scope.uploadTargetPicture = function () {
			// Clear messages
			$scope.success = $scope.error = null;

			// Start upload
			$scope.uploader.uploadAll();
		};

		// Cancel the upload process
		$scope.cancelUpload = function () {
			$scope.uploader.clearQueue();
			$scope.imageURL = '';
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
				imageURL: $scope.imageURL
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