const router = require('express').Router();

router.get('/register', async (req, res) => {
	res.status(200).send({ data: 'register route' });
})

router.get('/login', async (req, res) => {
	res.status(200).send({ data: 'login route' });
})

module.exports = router;