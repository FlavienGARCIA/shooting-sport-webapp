'use strict';

(function() {
	// Targets Controller Spec
	describe('Targets Controller Tests', function() {
		// Initialize global variables
		var TargetsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Targets controller.
			TargetsController = $controller('TargetsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Target object fetched from XHR', inject(function(Targets) {
			// Create sample Target using the Targets service
			var sampleTarget = new Targets({
				name: 'New Target'
			});

			// Create a sample Targets array that includes the new Target
			var sampleTargets = [sampleTarget];

			// Set GET response
			$httpBackend.expectGET('api/targets').respond(sampleTargets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.targets).toEqualData(sampleTargets);
		}));

		it('$scope.findOne() should create an array with one Target object fetched from XHR using a targetId URL parameter', inject(function(Targets) {
			// Define a sample Target object
			var sampleTarget = new Targets({
				name: 'New Target'
			});

			// Set the URL parameter
			$stateParams.targetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/targets\/([0-9a-fA-F]{24})$/).respond(sampleTarget);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.target).toEqualData(sampleTarget);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Targets) {
			// Create a sample Target object
			var sampleTargetPostData = new Targets({
				name: 'New Target'
			});

			// Create a sample Target response
			var sampleTargetResponse = new Targets({
				_id: '525cf20451979dea2c000001',
				name: 'New Target'
			});

			// Fixture mock form input values
			scope.name = 'New Target';

			// Set POST response
			$httpBackend.expectPOST('api/targets', sampleTargetPostData).respond(sampleTargetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Target was created
			expect($location.path()).toBe('/targets/' + sampleTargetResponse._id);
		}));

		it('$scope.update() should update a valid Target', inject(function(Targets) {
			// Define a sample Target put data
			var sampleTargetPutData = new Targets({
				_id: '525cf20451979dea2c000001',
				name: 'New Target'
			});

			// Mock Target in scope
			scope.target = sampleTargetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/targets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/targets/' + sampleTargetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid targetId and remove the Target from the scope', inject(function(Targets) {
			// Create new Target object
			var sampleTarget = new Targets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Targets array and include the Target
			scope.targets = [sampleTarget];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/targets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTarget);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.targets.length).toBe(0);
		}));
	});
}());