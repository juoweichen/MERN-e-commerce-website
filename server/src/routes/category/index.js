const router = require('express').Router();

const publicRoute = require('./public');
// const adminRoute = require('./admin');

router.use('/public', publicRoute);
// router.use('/admin', adminRoute);

module.exports = router;