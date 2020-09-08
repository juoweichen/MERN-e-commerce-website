const router = require('express').Router();

const MerchModel = require('../../models/merch');
const IdWM = require('../../middlewares/id');
const errorResponse = require('../../utils/error');

router.get('/all', (req, res) => {
	MerchModel.find({}, (err, merch) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(merch);
	})
})

router.get('/:id', [IdWM], (req, res) => {
	MerchModel.findById(req.params.id, (err, merch) => {
		if (err) return res.status(500).send(err);
		if (!merch) return res.status(404).send(errorResponse('merch Id has not found'));
		return res.status(200).send(merch);
	})
})

module.exports = router;
