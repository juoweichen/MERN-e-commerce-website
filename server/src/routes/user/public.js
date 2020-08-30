const router = require('express').Router();

router.get('/register', async (req, res) => {
	res.status(200).send('register route');
})

router.get('/login', async (req, res) => {
	res.status(200).send('login route');
})

module.exports = router;