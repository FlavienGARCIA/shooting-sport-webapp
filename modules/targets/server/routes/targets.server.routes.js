'use strict';

module.exports = function(app) {
	var targets = require('../controllers/targets.server.controller');
	var targetsPolicy = require('../policies/targets.server.policy');

	// Targets Routes
	app.route('/api/targets').all()
		.get(targets.list).all(targetsPolicy.isAllowed)
		.post(targets.create);

	app.route('/api/targets/:targetId').all(targetsPolicy.isAllowed)
		.get(targets.read)
		.put(targets.update)
		.delete(targets.delete);

	// Finish by binding the Target middleware
	app.param('targetId', targets.targetByID);
};