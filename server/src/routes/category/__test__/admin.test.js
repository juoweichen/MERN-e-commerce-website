const request = require('supertest');

const db = require('../../../utils/test/dbHandler');
const insert = require('../../../utils/test/insert');
const getMock = require('../../../utils/test/getMock');
const CategoryModel = require('../../../models/category');

const endPoint = '/api/category/admin';

describe(`${endPoint}`, () => {
	let server;
	let category1;
	let adminToken;

	beforeAll(async () => await db.connect())

	beforeEach(async () => {
		server = require('../../../../server');
		adminToken = getMock.adminJwt();
		// Insert mock category
		category1 = await insert.category({ name: 'Outfit' });
	})

	afterEach(async () => {
		await server.close();
		await db.clearDatabase();
	})

	afterAll(async () => await db.closeDatabase());

	describe('Authentication', () => {
		let notAdminToken = getMock.jwt({
			email: 'hacker@gmail.com',
			username: 'hacker',
			password: '123123',
		});

		it('Should return 401 if token has not provided', async () => {
			// Test with POST category/admin/new
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send({ name: 'Necklace' })
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(401);
		})
		it('Should return 403 if higher authurity required', async () => {
			// Test with POST category/admin/new
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send({ name: 'Necklace' })
				.set('x-auth-token', notAdminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(403);
		})
	})

	describe('POST /new', () => {
		it('Should return 200 if new category created', async () => {
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send({ name: 'Necklace' })
				.set('x-auth-token', adminToken);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.name === 'Necklace').toBeTruthy();
			CategoryModel.countDocuments((err, count) => {
				expect(count).toBe(2);
			})
		})
		it('Should return 400 if body validation failed', async () => {
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send({ name: 666 })
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
	})

	describe('PUT /:id', () => {
		it('Should return 200 if particular category updated', async () => {
			const res = await request(server)
				.put(`${endPoint}/${category1._id}`)
				.set('x-auth-token', adminToken)
				.send({ name: 'Outfit-winter' });
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.name).toBe('Outfit-winter');
			CategoryModel.countDocuments((err, count) => {
				expect(count).toBe(1);
			})
		})
		it('Should return 200 if req id is not found, create a new category', async () => {
			const res = await request(server)
				.put(`${endPoint}/${getMock.id()}`)
				.set('x-auth-token', adminToken)
				.send({ name: "Outfit-winter" });
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.name).toBe('Outfit-winter');
			CategoryModel.countDocuments((err, count) => {
				expect(count).toBe(2);
			})
		})
		it('Should return 400 if provided id is invalid', async () => {
			const res = await request(server)
				.put(`${endPoint}/somethingransom123123`)
				.set('x-auth-token', adminToken)
				.send({ name: 'Outfit-winter' });
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
		it('Should return 400 if req body is invalid', async () => {
			const res = await request(server)
				.put(`${endPoint}/${category1._id}`)
				.set('x-auth-token', adminToken)
				.send({ name: 123 });
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
	})

	describe('DELETE /:id', () => {
		it('Should return 200 if the target category has been deleted', async () => {
			const res = await request(server)
				.delete(`${endPoint}/${category1._id}`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.name).toBe(category1.name);
			CategoryModel.countDocuments((err, count) => {
				expect(count).toBe(0);
			})
		})
		it('Should return 404 if the target category has not found', async () => {
			const res = await request(server)
				.delete(`${endPoint}/${getMock.id()}`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
		it('Should return 400 if provided id is invalid', async () => {
			const res = await request(server)
				.delete(`${endPoint}/provideinvalididsillyyou`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
	})
})