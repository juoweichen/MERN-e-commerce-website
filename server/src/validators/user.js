const Joi = require('joi');

const baseSchema = Joi.object({
	password: Joi.string()
		.alphanum()
		.min(3)
		.max(1024).required(),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

function registerValidation(user) {
	const registerValidationSchema = baseSchema.keys({
		username: Joi.string()
			.alphanum()
			.min(3)
			.max(30).required(),
		password2: Joi.string()
			.required()
			.valid(Joi.ref('password'))
			.messages({ 'any.only': 'Confirm password must match password' })
	});
	return registerValidationSchema.validate(user);
}

function loginValidation(user) {
	return baseSchema.validate(user);
}

module.exports = {
	register: registerValidation,
	login: loginValidation
}