const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
	merchid: {
		type: String,
		required: true
	},
	image: {
		type: Buffer,
		required: true
	}
})
module.exports = mongoose.model('image', imageSchema);