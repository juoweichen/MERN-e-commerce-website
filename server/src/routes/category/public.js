const router = require('express').Router();

const CategoryModel = require('../../models/category');

router.get('/all', (req, res) => {
	CategoryModel.find({}, (err, categories) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(categories);
	})
})

module.exports = router;