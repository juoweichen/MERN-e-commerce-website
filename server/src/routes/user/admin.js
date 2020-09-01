const router = require('express').Router();

const authMW = require('../../middlewares/auth');
const amdinMW = require('../../middlewares/admin');
const idMW = require('../../middlewares/id');
const UserModel = require('../../models/user');
const errorResponse = require('../../utils/error');

router.use([authMW, amdinMW]);

/**
 * Find all user
 * @res - body: all user info
 */
router.get('/all', function (req, res) {
	UserModel.find({}, (err, users) => {
		if (err) return res.status(400).send(errorResponse(err));
		return res.status(200).send(users);
	})
})

/**
 * Find a user by id
 * @req - params: id
 * @res - body: target user info
 */
router.get('/:id', [idMW], function (req, res) {
	UserModel.findById(req.params.id, (err, user) => {
		if (err) return res.status(400).send(errorResponse(err));
		if (!user) return res.status(404).send(errorResponse('User Id not found'));
		return res.status(200).send(user);
	})
})

/**
 * Delete a user by id
 * @req - params: id
 * @res - body: target user info
 */
router.delete('/:id', [idMW], function (req, res) {
	UserModel.findByIdAndDelete(req.params.id, (err, user) => {
		if (err) return res.status(400).send(errorResponse(err));
		if (!user) return res.status(404).send(errorResponse('User Id not found'));
		return res.status(200).send(user);
	})
})

module.exports = router;