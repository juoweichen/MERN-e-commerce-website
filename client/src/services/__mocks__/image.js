export const getImageByMerchId = jest.fn((merchId) => {
	return new Promise((resolve, reject) => {
		process.nextTick(() => {
			merchId ?
				resolve({
					status: 200,
					data: {
						image: {
							data: 'imgbufferimgbufferimgbufferimgbufferimgbuffer'
						}
					}
				}) :
				reject({
					status: 400,
					data: {
						error: `Test Error Message: merchId: ${merchId} image fetch error`
					}
				})
		})
	})
})

