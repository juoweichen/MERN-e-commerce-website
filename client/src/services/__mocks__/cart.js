export function getCartById(cartId) {
	return new Promise((resolve, reject) => {
		process.nextTick(() => {
			cartId ?
				resolve({
					status: 200,
					data: {
						_id: cartId,
						totalAmount: 4,
						totalPrice: 250,
						items: [
							{ merchid: '123123123123', name: 'Shirt', amount: 1, price: 13.99, subTotalPrice: 13.99 },
							{ merchid: '234234234234', name: 'Cap', amount: 3, price: 12, subTotalPrice: 36 },
						]
					}
				}) :
				reject({
					status: 400,
					data: {
						error: 'Test Error Message: get cart by id error'
					}
				})
		})
	})
}

export function updateCart(cartid, newCart) {
	return new Promise((resolve, reject) => {
		process.nextTick(() => {
			cartid && newCart ?
				resolve({
					status: 200,
					data: { ...newCart }
				}) :
				reject({
					status: 400,
					data: {
						error: 'Test Error message: update cart failed'
					}
				})
		})
	})
}

export function addItemToCart(cartid, item) {
	return new Promise((resolve, reject) => {
		process.nextTick(() => {
			cartid && item ?
				resolve({
					status: 200,
					data: { ...item }
				}) :
				reject({
					status: 400,
					data: {
						error: 'Test Error message: update cart failed'
					}
				})
		})
	})
}

