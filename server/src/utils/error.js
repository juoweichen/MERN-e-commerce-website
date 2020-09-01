/**
 * Wrap error message into an object
 * @param {*} errorMessage 
 */
module.exports = function errorResponse(errorMessage) {
	return ({
		error: errorMessage
	})
}