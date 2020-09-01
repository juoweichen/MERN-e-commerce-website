export default {
	get: jest.fn(),
	post: jest.fn((apiUrl, body) => {
		if (apiUrl.match(/(user)\/(public)\/(login)/i)) {	// mock testing login
			if (body.email !== 'user1@gmail.com' || body.password !== '123123')
				throw {
					response: {
						data: {
							error: 'Testing message: incorrect email or password'
						}
					}
				}
		}
		if (apiUrl.match(/(user)\/(public)\/(register)/i)) {	// mock testing register
			if (body.email === 'sameuser@gmail.com')
				throw {
					response: {
						data: {
							error: 'Testing message: email already registered'
						}
					}
				}
		}
	}),
	put: jest.fn(),
	delete: jest.fn(),
	setJwtToken: jest.fn()
}