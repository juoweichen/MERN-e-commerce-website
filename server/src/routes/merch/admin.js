const router = require('express').Router();

const authMW = require('../../middlewares/auth');
const adminMW = require('../../middlewares/admin');
const idMW = require('../../middlewares/id');
const CategoryModel = require('../../models/category');
const MerchModel = require('../../models/merch');
const merchValidator = require('../../validators/merch');
const errorResponse = require('../../utils/error');
const isValidId = require('../../utils/validId');

router.use([authMW, adminMW])

/**
 * Create and save a new merch, 
 * need to get category before calling this func
 * @param {*} req - router request
 * @param {*} res - router response
 * @param {object} category - category of merch
 */
function createNewMerch(req, res, category) {
	// create new merch
	const newMerch = new MerchModel({
		name: req.body.name,
		category: category,
		price: req.body.price,
		description: req.body.description
	})
	// save to collection
	newMerch.save((err, result) => {
		if (err) return res.status(500).send(err);
		if (!result) return res.status(400).send(errorResponse('No result'))
		return res.status(200).send(result);
	})
}

/**
 * Create a new merch
 * @req - body: name, category id, price, description
 * @res - body: just created merch
 */
router.post('/new', (req, res) => {
	// validate
	const valid = merchValidator(req.body);
	if (valid.error)
		return res.status(400).send(errorResponse(valid.error));
	// validate category id before find it, because if id is not valid,
	// findById will throw error but not no result found
	if (!isValidId(req.body.categoryId))
		return res.status(400).send(errorResponse('Invalid category id'))
	// find merchtype first, if found, create new merch
	CategoryModel.findById(req.body.categoryId, (error, category) => {
		if (error) return res.status(500).send(errorResponse('Something failed...'))
		if (!category) return res.status(404).send(errorResponse('Category not found'))
		createNewMerch(req, res, category);
	})
})

/**
 * Update a particular merch of the category
 * @req - params: merch id
 * 			- body: merch update info
 * @res - body: updated or new created merch
 * NOTE: if merch id is not a valid model.Type.id, it will throw error
 * 			 if merch id is valid but not found, it will return null to result
 */
router.put('/:id', [idMW], (req, res) => {
	// // validate
	// const valid = merchValidator(req.body);
	// if (valid.error)
	// 	return res.status(400).send(errorResponse(valid.error));
	// // validate category id before find it, because if id is not valid,
	// // findById will throw error but not no result found
	// if (!isValidId())
	// 	return res.status(400).send(errorResponse('Invalid merchtype id'))
	// // get category id

	// NOTE: Not working on this before I finish admin frontend
})

/**
 * Delete a merch
 * @req - params: merch id
 * @res - body: deleted merch
 */
router.delete('/:id', [idMW], (req, res) => {
	MerchModel.findByIdAndDelete(req.params.id, (error, result) => {
		if (error) return res.status(500).send(errorResponse('Something fails...'))
		else if (!result) return res.status(404).send(errorResponse('Target Id not found'))
		else res.status(200).send(result);
	})
})

module.exports = router;
