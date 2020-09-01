const Joi = require('joi');

const cartItemSchema = Joi.object({
	_id: Joi.string(),
	merchid: Joi.string().required(),
	name: Joi.string().required(),
	price: Joi.number().min(0).max(999999).required(),
	amount: Joi.number().integer().min(0).max(10).required(),
	subTotalPrice: Joi.number().min(0).max(999999).required(),
})
const cartSchema = Joi.object({
	totalAmount: Joi.number().integer().min(0).max(100).required(),
	totalPrice: Joi.number().min(0).max(999999).required(),
	items: Joi.array().max(10).items(cartItemSchema).required(),
})

function cartItemValidation(item) {
	return cartItemSchema.validate(item);
}

function cartValidation(cart) {
	return cartSchema.validate(cart);
}

module.exports = {
	cart: cartValidation,
	item: cartItemValidation,
}
