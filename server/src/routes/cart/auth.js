const router = require('express').Router();

const authMW = require('../../middlewares/auth');
const idMW = require('../../middlewares/id');
const CartModel = require('../../models/cart');
const MerchModel = require('../../models/merch');
const cartValidator = require('../../validators/cart');
const errorResponse = require('../../utils/error');
const isValidId = require('../../utils/validId');
const calculateTotal = require('../../utils/cart');

router.use([authMW]);

/**
 * Find current user cart by cartid
 * @req - params: cartid
 * @res - body: cart info
 */
router.get('/:id', [idMW], (req, res) => {
	CartModel.findById(req.params.id, (error, cart) => {
		// find cart by id
		if (error) return res.status(500).send(errorResponse(error));
		if (!cart) return res.status(404).send(errorResponse('cartid not found'));
		res.status(200).send(cart);
	})
})

/**
 * Update all the content in cart, recalculate total
 * @req - params: id
 * 			- body: new cart
 * @res - body: updated cart
 */
router.put('/:id', [idMW], (req, res) => {
	CartModel.findById(req.params.id, (error, cart) => {
		// find cart by id
		if (error) return res.status(500).send(errorResponse(error));
		if (!cart) return res.status(404).send(errorResponse('cartid not found'));
		// validate request body cart
		const { error: invalidError } = cartValidator.cart(req.body);
		if (invalidError) return res.status(400).send(errorResponse(invalidError.details[0].message))
		// copy new items to cart
		const curItems = [...req.body.items];
		// recalculate total, save to db
		updateAndSaveCart(curItems, cart, res);
	})
})

/**
 * Add item to cart, if item already exist, add the amount onto it
 * NOTE: item need to calculte sub total price at frontend
 * @req - params: id
 * 			- body: new item and amount
 * @res - body: updated cart
 */
router.post('/:id', [idMW], (req, res) => {
	CartModel.findById(req.params.id, (cartErr, cart) => {
		// find cart by id
		if (cartErr) return res.status(500).send(errorResponse(cartErr));
		if (!cart) return res.status(404).send(errorResponse('cartid not found'));
		// validate request body item
		const { error: invalidError } = cartValidator.item(req.body);
		if (invalidError) return res.status(400).send(errorResponse(invalidError.details[0].message))
		// validate merch id
		if (!isValidId(req.body.merchid)) return res.status(400).send(errorResponse('merchid invalid'));
		// check merchid with db
		MerchModel.findById(req.body.merchid, (merchErr, merch) => {
			if (merchErr) return res.status(500).send(errorResponse(merchErr));
			if (!merch) return res.status(404).send(errorResponse('merchid not found'));
			// find if same merch exist in cart
			let isUpdateItem = false;
			let curItems = [...cart.items]; // NOTE: avoid change array while looping
			for (let i = 0; i < cart.items.length; i++) {
				if (cart.items[i].merchid == merch._id) {
					// Add last amount with current amount
					const newAmount = cart.items[i].amount + req.body.amount;
					// Restrict customer purchase same merch more then 10 per cart
					if (newAmount > 10)
						return res.status(409).send(errorResponse(
							'Can not purchase same merch more then 10 per cart, ' +
							`current allow ${10 - cart.items[i].amount} more, ` +
							'please make another orders'));
					// Add on amount and update items
					curItems[i] = {
						...cart.items[i]._doc, // NOTE: because mongoose model object
						amount: newAmount,
						subTotalPrice: newAmount * merch.price
					};
					isUpdateItem = true;
				}
			}
			// if new item is not in the cart
			if (!isUpdateItem) {
				if (curItems.length >= 10)	// Check if cart already filled with 10 kinds of merchs
					return res.status(409).send(errorResponse('cart merchs exceed 10'));
				curItems.push({ ...req.body })
			}
			// recalculate total, save to db
			updateAndSaveCart(curItems, cart, res);
		})
	})
})

/**
 * Delete item from cart
 * @req - params: id
 * 			- body: delete merchid
 * @res - body: updated cart
 */
router.delete('/:id', [idMW], (req, res) => {
	CartModel.findById(req.params.id, (error, cart) => {
		// find cart by id
		if (error) return res.status(500).send(errorResponse(error));
		if (!cart) return res.status(404).send(errorResponse('cartid not found'));
		// find and remove from items
		let newItems = cart.items.filter(item => item.merchid !== req.body.merchid)
		// recalculate total, save to db
		updateAndSaveCart(newItems, cart, res);
	})
})

/**
 * recalculate total, save cart to db
 * @param {*} cart 
 * @param {*} res 
 */
function updateAndSaveCart(curItems, cart, res) {
	cart.items = curItems;
	// recalculate total
	const total = calculateTotal(cart.items);
	cart.totalAmount = total.amount;
	cart.totalPrice = total.price;
	// Update cart
	cart.save(function (err, updatedCart) {
		if (err) return res.status(503).send(errorResponse(err.message.error));
		res.status(200).send(updatedCart);
	});
}

module.exports = router;