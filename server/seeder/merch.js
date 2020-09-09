const seeder = require('mongoose-seed');

const getMock = require('../src/utils/test/getMock');
const dbUrl = require('./utils').getDb();

seeder.connect(dbUrl, { useUnifiedTopology: true }, () => {
	// Load Mongoose models
	// NOTE: Must place in server, otherwise mongoose will call error
	// 			 -> Models not registered in Mongoose
	seeder.loadModels([
		'src/models/category.js',
		'src/models/merch.js',
		'src/models/image.js'
	]);
	// Clear specified collections
	seeder.clearModels(['category', 'merch', 'image'], async () => {
		// Callback to populate DB once collections have been cleared
		seeder.populateModels(getSeedData(), () => {
			console.log('Seeding completed, db disconnected');
			seeder.disconnect();
		});
	});
})

function createNewItem(item) {
	return {
		...item,
		_id: getMock.id(),
	}
}

function createNewImage({ merchid }) {
	return ({
		merchid,
		image: {
			type: 'Buffer',
			data: [0, 0, 0, 0, 0]
		},
		_id: getMock.id()
	})
}

function getSeedData() {
	const category1 = createNewItem({ name: 'Outfit' });
	const category2 = createNewItem({ name: 'Shoes' });
	const merch1 = createNewItem({
		name: 'T-shirt',
		category: category1,
		price: 13.99,
		description: 'T-shirt description blahblahblahblah'
	})
	const merch2 = createNewItem({
		name: 'Jacket',
		category: category1,
		price: 49.99,
		description: 'Jacket description blahblahblahblah'
	})
	const merch3 = createNewItem({
		name: 'Sneaker',
		category: category2,
		price: 59.99,
		description: 'Sneaker description blahblahblahblah'
	})
	const image1 = createNewImage({ merchid: merch1._id })
	const image2 = createNewImage({ merchid: merch2._id })
	const image3 = createNewImage({ merchid: merch3._id })

	return [
		{
			'model': 'category',
			'documents': [category1, category2]
		},
		{
			'model': 'merch',
			'documents': [merch1, merch2, merch3]
		},
		{
			'model': 'image',
			'documents': [image1, image2, image3]
		}
	]
}
