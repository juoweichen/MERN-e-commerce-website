const Joi = require('joi');

module.exports = (image) => {
	const imageSchema = Joi.object({
		fieldname: Joi.string(),
		originalname: Joi.string(),
		encoding: Joi.string(),
		mimetype: Joi.string(),
		buffer: Joi.binary().required(),
		size: Joi.number()
	})
	return imageSchema.validate(image);
}

// file:  {
//   fieldname: 'image',
//   originalname: 'cowboy hat.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 03 b6 00 00 02 52 08 03 00 00 00 c0 86 a9 8a 00 00 02 c7 50 4c 54 45 47 70 4c 51 49 44 92 65 4b ... 251287 more bytes>,
//   size: 251337
// }