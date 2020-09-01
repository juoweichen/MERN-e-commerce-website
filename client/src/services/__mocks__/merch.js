export const getMerchs = jest.fn(() => {
	return {
		status: 200,
		data: [
			{ _id: 0, name: 'Jeans', category: { _id: '5f2b7117cbd46fc6958175d4', name: 'Outfit' }, price: 20.99 },
			{ _id: 1, name: 'Shirt', category: { _id: '5f2b7117cbd46fc6958175d4', name: 'Outfit' }, price: 15.99 },
			{ _id: 2, name: 'Skirts', category: { _id: '5f2b7117cbd46fc6958175d4', name: 'Outfit' }, price: 12.99 },
			{ _id: 3, name: 'Sneakers', category: { _id: '5f2b714acbd46fc6958175d5', name: 'Shoes' }, price: 25.99 },
			{ _id: 4, name: 'Casual', category: { _id: '5f2b714acbd46fc6958175d5', name: 'Shoes' }, price: 17.99 },
			{ _id: 5, name: 'Cap', category: { _id: '5f2b7402f30140cbdbd26b90', name: 'Hat' }, price: 10.99 },
		]
	}
});
export const getMerchById = jest.fn((merchid) => {
	return new Promise((resolve, reject) => {
		process.nextTick(() => {
			merchid ?
				resolve({
					status: 200,
					data: {
						_id: merchid,
						name: 'Shirt',
						category: { _id: '5f2b7117cbd46fc6958175d4', name: 'Outfit' },
						price: 15.99,
						description: 'This shirt is so cool that the staff in the shop will complement you'
					}
				}) :
				reject({
					status: 400,
					data: {
						error: 'Test Error Message: get merch by id error'
					}
				})
		})
	})
});