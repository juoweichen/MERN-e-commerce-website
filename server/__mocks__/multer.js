module.exports = function () {
	return ({
		single: (fileName) => {
			return function (req, res, next) {
				req.file = req.body.image;
				next()
			}
		}
	})
}