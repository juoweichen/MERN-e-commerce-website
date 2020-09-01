const request = require('supertest');

const db = require('../../../utils/test/dbHandler');
const insert = require('../../../utils/test/insert');
const getMock = require('../../../utils/test/getMock');

const endPoint = '/api/user/admin/';

describe(`${endPoint}`, () => {
	let server;
	let user1, user2;
	let adminToken;

	beforeAll(async () => await db.connect());

	beforeEach(async () => {
		server = require('../../../../server');
		adminToken = getMock.adminJwt();
		// Insert mock users
		user1 = await insert.user({
			email: 'user1@gmail.com',
			username: 'user1',
			password: '123123',
		})
		user2 = await insert.user({
			email: 'user2@gmail.com',
			username: 'user2',
			password: '123123',
		})
	})

	afterEach(async () => {
		await server.close();
		await db.clearDatabase();
	})

	afterAll(async () => await db.closeDatabase());

	describe('Authurization', () => {
		it('Should return 403 if higher authurity required', async () => {
			const NotAdminToken = getMock.jwt(user1.toObject());	// send user token
			const res = await request(server)
				.get(endPoint + '/all')
				.set('x-auth-token', NotAdminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(403);
		})
	})

	describe('GET /user/all', () => {
		it('should return 200 if get all users', async () => {
			const res = await request(server)
				.get(endPoint + '/all')
				.set('x-auth-token', adminToken);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(user => user.username === 'user1')).toBeTruthy();
			expect(res.body.some(user => user.username === 'user2')).toBeTruthy();
		})
	})

	describe('GET /user/:id', () => {
		it('should return 200 when get the specific user', async () => {
			// pass user1 id
			const res = await request(server)
				.get(`${endPoint}/${user1._id}`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.username === 'user1').toBeTruthy();
		})

		it('should return 404 if input id user is not valid', async () => {
			// pass a random id
			const res = await request(server)
				.get(`${endPoint}/qwertyuioparandomidqwertyuio`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})

		it('should return 404 if user id has not found', async () => {
			// pass a random id
			const res = await request(server)
				.get(`${endPoint}/${getMock.id()}`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
	})

	describe('DELETE /user/:id', () => {
		it('Should return 200 if delete a user successfully ', async () => {
			// delete user1
			const res = await request(server)
				.delete(`${endPoint}/${user1._id}`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.username === 'user1').toBeTruthy();
		})

		it('Should return 400 if user id is not valid', async () => {
			// random id
			const res = await request(server)
				.delete(`${endPoint}/qwertyuioasdfghjk`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})

		it('Should return 404 if user id has not found', async () => {
			// random id
			const res = await request(server)
				.delete(`${endPoint}/${getMock.id()}`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
	})
})