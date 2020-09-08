const router = require('express').Router();
const multer = require('multer')

const authMW = require('../../middlewares/auth');
const adminMW = require('../../middlewares/admin');
const idMW = require('../../middlewares/id');
const ImageModel = require('../../models/image');
const MerchModel = require('../../models/merch');
const errorResponse = require('../../utils/error');
const isValidId = require('../../utils/validId');
const imageValidator = require('../../validators/image');

router.use([authMW, adminMW]);
const upload = multer();

router.post('/new', upload.single('image'), (req, res) => {
	// validate merchid
	if (!isValidId(req.body.merchid)) return res.status(400).send(errorResponse('Invalid merchid'));
	// validate image file
	const { error: invalidError } = imageValidator(req.file);
	if (invalidError) return res.status(400).send(errorResponse(invalidError));
	// Find merch by id in the db
	MerchModel.findById(req.body.merchid, (err, merch) => {
		if (err) return res.status(500).send(errorResponse(err))
		else if (!merch) return res.status(404).send(errorResponse('merchid not found'))

		const newImage = new ImageModel({
			merchid: req.body.merchid,
			image: req.file.buffer
		})
		newImage.save((err, image) => {
			if (err) return res.status(501).send(errorResponse(err));
			if (!image) return res.status(400).send(errorResponse('no image'))
			return res.status(200).send(image);
		})
	})
})

router.delete('/merchid/:id', [idMW], (req, res) => {
	ImageModel.findOneAndDelete({ merchid: req.params.id }, (err, result) => {
		if (err) return res.status(500).send(errorResponse(err))
		else if (!result) return res.status(404).send(errorResponse('merchid not found'))
		else res.status(200).send(result);
	})
})

module.exports = router;