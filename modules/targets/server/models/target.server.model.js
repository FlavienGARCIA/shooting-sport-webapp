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
	inBlackPerc: Number,
	bullets: Array,
	distance: String,
	weapon: String,
	caliber: String,
	ammo: String,
	imageURL: {
		type: String,
		default: 'modules/targets/img/profile/default.png'
	},
	cropData: {
		x: Number,
		y: Number,
		width: Number,
		height: Number,
		rotate: Number
	},
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
