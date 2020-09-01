const mongoose = require('mongoose')
const CategoryModel = require('./category');

const merchSchema = new mongoose.Schema({
	name: {
		type: String,
		max: 99,
		required: true
	},
	category: {
		type: CategoryModel.schema,
		required: true
	},
	price: {
		type: Number,
		min: 0,
		max: 999999,
		required: true
	},
	description: {
		type: String,
		max: 9999
	}
})
module.exports = mongoose.model('merch', merchSchema);
