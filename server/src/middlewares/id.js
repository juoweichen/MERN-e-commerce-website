const mongoose = require('mongoose');
const errorResponse = require('../utils/error');

/**
 * Mongo model ObjectId varification middleware
 * Error status code: 400 Invalid ID, ie. some random string
 * NOTE: isValid condition: not null, 12 bytes string, 24 char hex string 
 * @req - params.id: objectId
 * @res - error message if something goes wrong
 * @next - next middleware
 */
module.exports = function (req, res, next) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(400).send(errorResponse('Invalid req.params.id'));
	next();
}