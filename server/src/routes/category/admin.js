const router = require('express').Router();

const authMW = require('../../middlewares/auth');
const adminMW = require('../../middlewares/admin');
const CategoryModel = require('../../models/category');
const CategoryValidator = require('../../validators/category');
const IdWM = require('../../middlewares/id');
const errorResponse = require('../../utils/error');

router.use([authMW, adminMW]);

/**
 * Create and save a new category
 * @param {*} req - router request
 * @param {*} res - router response
 */
function createNewCategory(req, res) {
	// create new category
	const newCategory = new CategoryModel({ name: req.body.name })
	// save to collection
	newCategory.save((err, result) => {
		if (err) return res.status(500).send(errorResponse(err));
		if (!result) return res.status(400).send(errorResponse('No result'))
		return res.status(200).send(result);
	})
}

/**
 * Create a new category
 * @req - body: name
 * @res - body: just created category
 */
router.post('/new', (req, res) => {
	// Validate
	const valid = CategoryValidator(req.body);
	if (valid.error)
		return res.status(400).send(errorResponse(valid.error));
	createNewCategory(req, res);
})

/**
 * Update a category
 * @req - body: name
 * 			- params: category id
 * @res - body: updated category
 */
router.put('/:id', [IdWM], (req, res) => {
	// Validate
	const valid = CategoryValidator(req.body);
	if (valid.error)
		return res.status(400).send(errorResponse(valid.error));
	// Find and update
	const updateBody = { name: req.body.name };
	CategoryModel.findByIdAndUpdate(
		req.params.id,
		updateBody,
		{ new: true },
		(error, result) => {
			if (error) return res.status(500).send(errorResponse('Something fails...'))
			else if (!result) createNewCategory(req, res);
			else res.status(200).send(result);	// found id, update exist merchtype
		})
})

/**
 * Delete a category
 * @req - params: category id
 * @res - body: deleted category
 */
router.delete('/:id', [IdWM], (req, res) => {
	CategoryModel.findByIdAndDelete(req.params.id, (error, result) => {
		if (error) return res.status(500).send(errorResponse('Something fails...'))
		else if (!result) return res.status(404).send(errorResponse('Target Id not found'))
		else res.status(200).send(result);
	})
})

module.exports = router;