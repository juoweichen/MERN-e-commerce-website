const seeder = require('mongoose-seed');
const bcrypt = require('bcrypt');

const getMock = require('../src/utils/test/getMock');

const dbUrl = process.env.DB_URL;
if (!dbUrl) throw new Error('DB_URL not found');

seeder.connect(dbUrl, () => {
	// Load Mongoose models
	// NOTE: Must place in server, otherwise mongoose will call error
	// 			 -> Models not registered in Mongoose
	seeder.loadModels([
		'src/models/user.js',
		'src/models/cart.js'
	]);
	// Clear specified collections
	seeder.clearModels(['user', 'cart'], async () => {
		// Callback to populate DB once collections have been cleared
		seeder.populateModels(await getSeedData(), () => {
			seeder.disconnect();
		});
	});
})

function createNewCart() {
	return ({
		_id: getMock.id(),
		totalAmount: 0,
		totalPrice: 0,
		items: []
	})
}

async function createNewUser({ username, password, email, cartid }) {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	return ({
		username: username,
		password: hashedPassword,
		email: email,
		cartid: cartid,
	})
}

async function getSeedData() {
	const cart1 = createNewCart();
	const cart2 = createNewCart();
	let testadmin = await createNewUser({
		username: 'testadmin',
		email: 'testadmin@gmail.com',
		password: 'testadmin',
		cartid: cart1._id
	})
	testadmin = {
		...testadmin,
		isAdmin: true,
	}
	let testuser = await createNewUser({
		username: 'testuser1',
		email: 'testuser1@gmail.com',
		password: '123123',
		cartid: cart2._id
	})
	return [
		{
			'model': 'cart',
			'documents': [cart1, cart2]
		},
		{
			'model': 'user',
			'documents': [testadmin, testuser]
		}
	]
}
