const jwt = require('jsonwebtoken');
const errorResponse = require('../utils/error');

/**
 * user authurization middleware, check request token
 * Error status code: 401 auth token required
 * 										498 invalid token, ie. lost private key
 * @req - header: x-auth-token with user level authentication
 * @res - error message if something goes wrong
 * @next - next middleware
 */
function authMiddleWare(req, res, next) {
	const token = req.header('x-auth-token');
	if (!token)
		return res.status(401).send(errorResponse("auth token required"));
	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		req.user = decoded;	// For pass onto adminMiddleware
		next();
	}
	catch (ex) {
		res.status(498).send(errorResponse('Invalid token'));
	}
}
module.exports = authMiddleWare;