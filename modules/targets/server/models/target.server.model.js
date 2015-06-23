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
	score: String,
	meanScore: Number,
	flooredMeanScore:Number,
	bulletCount: Number,
	inBlack: Number,
	bullets: Array,
	distance: String,
	weapon: String,
	caliber: String,
	ammo: String,
	dt: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Target', TargetSchema);