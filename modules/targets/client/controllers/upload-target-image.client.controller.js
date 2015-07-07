'use strict';

angular.module('targets').controller('UploadTargetImageController', ['$scope', '$stateParams', '$location', 'Authentication', 'Targets', 'FileUploader', '$timeout', '$window',
	function($scope, $stateParams, $location, Authentication, Targets, FileUploader, $timeout, $window) {

		// Create file uploader instance
		$scope.$parent.uploader = new FileUploader({
			url: 'api/targets/picture'
		});

		// Set file uploader image filter
		$scope.$parent.uploader.filters.push({
			name: 'imageFilter',
			fn: function (item, options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});

		// Called after the user selected a new picture file
		$scope.$parent.uploader.onAfterAddingFile = function (fileItem) {
			if ($window.FileReader) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = function (fileReaderEvent) {
					$timeout(function () {
						$scope.$parent.imageURL = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

		// Called after the user has successfully uploaded a new picture
		$scope.$parent.uploader.onSuccessItem = function (fileItem, response, status, headers) {
			// Show success message
			$scope.$parent.success = true;

			$scope.$parent.imageURL = response.imageUrl;
			$scope.$parent.initCropper();
			$scope.$parent.setCurrentStateByName('image');

			// Clear upload buttons
			$scope.$parent.uploader.clearQueue();
		};

		// Called after the user has failed to uploaded a new picture
		$scope.$parent.uploader.onErrorItem = function (fileItem, response, status, headers) {
			// Clear upload buttons
			$scope.$parent.uploader.clearQueue();

			// Show error message
			$scope.$parent.error = response.message;
		};

		// Change user profile picture
		$scope.$parent.uploadTargetPicture = function () {
			// Clear messages
			$scope.$parent.success = $scope.$parent.error = null;

			// Start upload
			$scope.$parent.uploader.uploadAll();
		};

		// Cancel the upload process
		$scope.$parent.cancelUpload = function () {
			$scope.$parent.uploader.clearQueue();
			$scope.$parent.imageURL = '';
		};
	}
]);