const errorResponse = require('../utils/error');

/**
 * admin authurization middleware, must join after authMiddleware
 * Error status code: 403 Higher Authurity required, not admin
 * @req - user: element from authMiddleware, need to contain isAdmin
 * @res - error message if something goes wrong
 * @next - next middleware
 */
module.exports = function (req, res, next) {
	if (!req.user.isAdmin)
		return res.status(403).send(errorResponse("Higher Authurity required"));
	next();
}
