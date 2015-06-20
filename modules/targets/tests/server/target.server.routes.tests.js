'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Target = mongoose.model('Target'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, target;

/**
 * Target routes tests
 */
describe('Target CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Target
		user.save(function() {
			target = {
				name: 'Target Name'
			};

			done();
		});
	});

	it('should be able to save Target instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Target
				agent.post('/api/targets')
					.send(target)
					.expect(200)
					.end(function(targetSaveErr, targetSaveRes) {
						// Handle Target save error
						if (targetSaveErr) done(targetSaveErr);

						// Get a list of Targets
						agent.get('/api/targets')
							.end(function(targetsGetErr, targetsGetRes) {
								// Handle Target save error
								if (targetsGetErr) done(targetsGetErr);

								// Get Targets list
								var targets = targetsGetRes.body;

								// Set assertions
								(targets[0].user._id).should.equal(userId);
								(targets[0].name).should.match('Target Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Target instance if not logged in', function(done) {
		agent.post('/api/targets')
			.send(target)
			.expect(403)
			.end(function(targetSaveErr, targetSaveRes) {
				// Call the assertion callback
				done(targetSaveErr);
			});
	});

	it('should not be able to save Target instance if no name is provided', function(done) {
		// Invalidate name field
		target.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Target
				agent.post('/api/targets')
					.send(target)
					.expect(400)
					.end(function(targetSaveErr, targetSaveRes) {
						// Set message assertion
						(targetSaveRes.body.message).should.match('Please fill Target name');
						
						// Handle Target save error
						done(targetSaveErr);
					});
			});
	});

	it('should be able to update Target instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Target
				agent.post('/api/targets')
					.send(target)
					.expect(200)
					.end(function(targetSaveErr, targetSaveRes) {
						// Handle Target save error
						if (targetSaveErr) done(targetSaveErr);

						// Update Target name
						target.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Target
						agent.put('/api/targets/' + targetSaveRes.body._id)
							.send(target)
							.expect(200)
							.end(function(targetUpdateErr, targetUpdateRes) {
								// Handle Target update error
								if (targetUpdateErr) done(targetUpdateErr);

								// Set assertions
								(targetUpdateRes.body._id).should.equal(targetSaveRes.body._id);
								(targetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Targets if not signed in', function(done) {
		// Create new Target model instance
		var targetObj = new Target(target);

		// Save the Target
		targetObj.save(function() {
			// Request Targets
			request(app).get('/api/targets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Target if not signed in', function(done) {
		// Create new Target model instance
		var targetObj = new Target(target);

		// Save the Target
		targetObj.save(function() {
			request(app).get('/api/targets/' + targetObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', target.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Target instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Target
				agent.post('/api/targets')
					.send(target)
					.expect(200)
					.end(function(targetSaveErr, targetSaveRes) {
						// Handle Target save error
						if (targetSaveErr) done(targetSaveErr);

						// Delete existing Target
						agent.delete('/api/targets/' + targetSaveRes.body._id)
							.send(target)
							.expect(200)
							.end(function(targetDeleteErr, targetDeleteRes) {
								// Handle Target error error
								if (targetDeleteErr) done(targetDeleteErr);

								// Set assertions
								(targetDeleteRes.body._id).should.equal(targetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Target instance if not signed in', function(done) {
		// Set Target user 
		target.user = user;

		// Create new Target model instance
		var targetObj = new Target(target);

		// Save the Target
		targetObj.save(function() {
			// Try deleting Target
			request(app).delete('/api/targets/' + targetObj._id)
			.expect(403)
			.end(function(targetDeleteErr, targetDeleteRes) {
				// Set message assertion
				(targetDeleteRes.body.message).should.match('User is not authorized');

				// Handle Target error error
				done(targetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Target.remove().exec(function(){
				done();
			});
		});
	});
});
