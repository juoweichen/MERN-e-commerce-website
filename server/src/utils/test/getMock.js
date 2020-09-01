const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function getMockToken(obj) {
	return jwt.sign(
		obj,
		process.env.JWT_PRIVATE_KEY
	)
}

function getMockObjectIdHex() {
	return new mongoose.Types.ObjectId().toHexString()
}

function getMockAdminToken() {
	return getMockToken({
		email: 'admin@gmail.com',
		username: 'admin',
		password: 'admin',
		isAdmin: true
	});
}

module.exports = {
	jwt: getMockToken,
	id: getMockObjectIdHex,
	adminJwt: getMockAdminToken,
}