const router = require('express').Router();

const CategoryModel = require('../../models/category');
const IdWM = require('../../middlewares/id');
const errorResponse = require('../../utils/error');

router.get('/all', (req, res) => {
	CategoryModel.find({}, (err, categories) => {
		if (err) return res.status(500).send(errorResponse(err));
		return res.status(200).send(categories);
	})
})

router.get('/:id', [IdWM], (req, res) => {
	CategoryModel.findById(req.params.id, (err, category) => {
		if (err) return res.status(500).send(errorResponse(err));
		if (!category) return res.status(404).send(errorResponse('category Id has not found'));
		return res.status(200).send(category);
	})
})

module.exports = router;