const router = require('express').Router();

const idMW = require('../../middlewares/id');
const ImageModel = require('../../models/image');
const errorResponse = require('../../utils/error');

router.get('/merchid/:id', [idMW], (req, res) => {
	ImageModel.findOne({ merchid: req.params.id }, (err, image) => {
		if (err) return res.status(500).send(errorResponse(err));
		if (!image) return res.status(404).send(errorResponse('image Id has not found'));
		return res.status(200).send(image);
	})
})

module.exports = router;