const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');

const cartItemSchema = new mongoose.Schema({
	merchid: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		default: 0,
		min: 0,
		required: true
	},
	amount: {
		type: Int32,
		default: 0,
		min: 0,
		max: 999,
		required: true
	},
	subTotalPrice: {
		type: Number,
		default: 0,
		min: 0,
		required: true
	}
})

const cartSchema = new mongoose.Schema({
	totalAmount: {
		type: Number,
		default: 0,
		min: 0,
		max: 9999,
		required: true
	},
	totalPrice: {
		type: Number,
		default: 0,
		min: 0,
		required: true
	},
	items: {
		type: [cartItemSchema],
		minlength: 0,
		maxlength: 999,
		required: true
	}
})
module.exports = mongoose.model('cart', cartSchema);