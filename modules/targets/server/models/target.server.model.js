'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Target Schema
 */
var TargetSchema = new Schema({
	score: {
		type: String
	},
	meanScore: {
		type: Number
	},
	bulletCount: {
		type: Number
	},
	bullets: Array,
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Target', TargetSchema);