'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Target = mongoose.model('Target'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Target
 */
exports.create = function(req, res) {
	var target = new Target(req.body);
	target.user = req.user;

	target.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(target);
		}
	});
};

/**
 * Show the current Target
 */
exports.read = function(req, res) {
	res.jsonp(req.target);
};

/**
 * Update a Target
 */
exports.update = function(req, res) {
	var target = req.target ;

	target = _.extend(target , req.body);

	target.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(target);
		}
	});
};

/**
 * Delete an Target
 */
exports.delete = function(req, res) {
	var target = req.target ;

	target.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(target);
		}
	});
};

/**
 * List of Targets
 */
exports.list = function(req, res) { Target.find().sort('-created').populate('user', 'displayName').exec(function(err, targets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(targets);
		}
	});
};

/**
 * Target middleware
 */
exports.targetByID = function(req, res, next, id) { Target.findById(id).populate('user', 'displayName').exec(function(err, target) {
		if (err) return next(err);
		if (! target) return next(new Error('Failed to load Target ' + id));
		req.target = target ;
		next();
	});
};