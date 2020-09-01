const Joi = require('joi');

module.exports = (category) => {
	const categorySchema = Joi.object({
		name: Joi.string().min(1).required()
	})
	return categorySchema.validate(category);
}