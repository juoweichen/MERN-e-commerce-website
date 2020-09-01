const Joi = require('joi');

module.exports = (merch) => {
	const merchSchema = Joi.object({
		name: Joi.string().min(1).max(50).required(),
		categoryId: Joi.string().required(),
		price: Joi.number().min(0).max(999999).required(),
		description: Joi.string()
	})
	return merchSchema.validate(merch);
}