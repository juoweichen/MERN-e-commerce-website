import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

function getMockObjectIdHex() {
	return ([...Array(12)].map(i => (~~(Math.random() * 36)).toString(36)).join(''));
}

async function getMockUser({ email, username, password }) {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const newUser = {
		_id: getMockObjectIdHex(),
		username: username,
		password: hashedPassword,
		email: email,
		cartId: getMockObjectIdHex(),
	}
	return newUser;
}

function getMockItem(content) {
	return {
		_id: getMockObjectIdHex(),
		...content
	}
}

function getMockToken(obj) {
	return jwt.sign(
		obj,
		'mockServerPrivateKey'
	)
}

export default {
	id: getMockObjectIdHex,
	user: getMockUser,
	item: getMockItem,
	jwt: getMockToken
}