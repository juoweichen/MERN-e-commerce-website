const request = require('supertest');
const jwt = require('jsonwebtoken');

const db = require('../../../utils/test/dbHandler');
const insert = require('../../../utils/test/insert');

const endPoint = '/api/user/public/'

describe(`${endPoint}`, () => {
	let server;

	beforeAll(async () => await db.connect())

	beforeEach(() => {
		server = require('../../../../server');
	})

	afterEach(async () => {
		await server.close();
		await db.clearDatabase();
	})

	afterAll(async () => await db.closeDatabase());

	describe('POST /register', () => {
		it('should create new user', async () => {
			// correct post
			const res = await request(server)
				.post(`${endPoint}/register`)
				.send({
					username: 'user1',
					email: 'user1@gmail.com',
					password: '123123',
					password2: '123123'
				});
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.username).toBe('user1');
		})

		it('should return 400 if required field is missing', async () => {
			// username field is missing
			const res = await request(server)
				.post(`${endPoint}/register`)
				.send({
					password: '123123',
					password2: '123123',
					email: 'user1@gmail.com'
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})

		it('should return 400 if email format is incorrect', async () => {
			// Pass incorrect body
			const res = await request(server).post(`${endPoint}/register`)
				.send({
					username: 'user1',
					password: '123123',
					password2: '123123',
					email: 'user1@gmail'
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})

		it('should return 400 if user is already registered', async () => {
			// Create test user1
			await insert.user({
				username: 'user1',
				password: '123123',
				email: 'user1@gmail.com'
			});
			// Attemp to post user1 again
			const res = await request(server).post(`${endPoint}/register`)
				.send({
					username: 'user1',
					password: '123123',
					password2: '123123',
					email: 'user1@gmail.com'
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})

		it('Should return 400 if password confirmation is not match password', async () => {
			// Pass not match password2
			const res = await request(server).post(`${endPoint}/register`)
				.send({
					username: 'user1',
					email: 'user1@gmail.com',
					password: '123123',
					password2: '123'
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
	})

	describe('POST /login', () => {
		beforeEach(async () => {
			await insert.user({
				username: 'user1',
				password: '123123',
				email: 'user1@gmail.com'
			});
		})

		it('should send user info and x-auth-token if login succeed', async () => {
			// correct post
			const res = await request(server).post(`${endPoint}/login`)
				.send({
					email: 'user1@gmail.com',
					password: '123123'
				});
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.email).toBe('user1@gmail.com');
			expect(res.header['x-auth-token']).toBeDefined();
			// check payload
			const decoded = jwt.verify(res.header['x-auth-token'], process.env.JWT_PRIVATE_KEY);
			expect(decoded.username).toBe('user1');
		})

		it('should return 400 if email format is incorrect', async () => {
			// incorrect email
			const res = await request(server).post(`${endPoint}/login`)
				.send({
					password: '123123',
					email: 'user1@gmail.commmmm'
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})

		it('should return 401 if password is incorrect', async () => {
			// incorrect password
			const res = await request(server).post(`${endPoint}/login`)
				.send({
					password: '456456',
					email: 'user1@gmail.com'
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(401);
		})

		it('should return 404 if email is not exist', async () => {
			// Email not found
			const res = await request(server).post(`${endPoint}/login`)
				.send({
					password: '123123',
					email: 'userNotExist@gmail.com'
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
	})
})