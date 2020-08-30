const request = require('supertest');

const endPoint = '/api/user/public/'

describe(`${endPoint}`, () => {
	let server;

	beforeEach(() => {
		server = require('../../../../server');
	})

	afterEach(async () => {
		await server.close();
	})

	describe('POST /register', () => {
		it('Should ', async () => {
			// fake
			const res = await request(server)
				.get(`${endPoint}/register`);
			expect(res.status).toBe(200);
			expect(res.body.data).toMatch(/register/i);
		})
	})
})