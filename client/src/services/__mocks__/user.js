import getMock from 'utils/test/getMock';

export default {
	getCurrent: jest.fn(() => {
		return {
			username: 'admin',
			email: 'admin@gmail.com',
			password: 'XXXXXX',
			isAdmin: true
		}
	}),
	getJwt: jest.fn(async () => {
		return (
			getMock.jwt(await getMock.user({
				email: 'user1@gmail.com',
				username: 'user1',
				password: '123123'
			}))
		)
	})
}
