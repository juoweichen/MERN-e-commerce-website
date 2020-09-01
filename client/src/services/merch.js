import http from './http'

const apiUrl = '/api/merch/public';

export function getMerchs() {
	return http.get(`${apiUrl}/all`);
}

export function getMerchById(merchid) {
	return http.get(`${apiUrl}/${merchid}`);
}

export function updateMerchById(merchid, updateMerch) {
	return new Promise((resolve, reject) => {
		process.nextTick(() => {
			merchid && updateMerch ?
				resolve({
					status: 200,
					data: {
						_id: merchid,
						name: 'Shirt',
						category: { _id: '5f2b7117cbd46fc6958175d4', name: 'Outfit' },
						price: 15.99,
						description: 'You just update a shirt'
					}
				}) :
				reject({
					status: 400,
					data: {
						error: 'Test Error Message: update merch by id error'
					}
				})
		})
	})
}
