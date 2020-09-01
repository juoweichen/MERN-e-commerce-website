const mongoose = require('mongoose');

module.exports = (targetId) => {
	return mongoose.Types.ObjectId.isValid(targetId)
}