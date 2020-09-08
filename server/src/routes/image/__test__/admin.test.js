const request = require('supertest');

const db = require('../../../utils/test/dbHandler');
const insert = require('../../../utils/test/insert');
const getMock = require('../../../utils/test/getMock');

const endPoint = '/api/image/admin';

describe(`${endPoint}`, () => {
	let server;
	let sendBody;
	let category1;
	let merch1, merch2;
	let image1;
	let adminToken;

	beforeAll(async () => await db.connect());

	beforeEach(async () => {
		server = require('../../../../server');
		adminToken = getMock.adminJwt();
		// insert mock data
		category1 = await insert.category({ name: 'Outfit' });
		merch1 = await insert.merch({
			name: 'Jeans',
			category: category1,
			price: 20.99,
			description: 'A very comfy jeans'
		})
		merch2 = await insert.merch({
			name: 'Shirt',
			category: category1,
			price: 12.99,
			description: 'A regular shirt'
		});
		image1 = await insert.image({ merchid: merch2._id })
		// set sendBody for post
		sendBody = { // mock FormData
			merchid: merch1._id,
			image: { buffer: '123123123' }	// Must be string or buffer, will convert to binary later by mongo
		}
	})

	afterEach(async () => {
		await server.close();
		await db.clearDatabase();
	})

	afterAll(async () => await db.closeDatabase());

	describe('Authurization', () => {
		let notAdminToken = getMock.jwt({
			email: 'hacker@gmail.com',
			username: 'hacker',
			password: '123123',
		});
		// Test with POST image/admin/new
		it('should return 498 if token is invalid', async () => {
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send(sendBody)
				.set('x-auth-token', 'notavalidtokenxxxxxxxyaayayyayahahahhahahaXdddddd');
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(498);
		})
		it('should return 401 if token has not provided', async () => {
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send(sendBody)
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(401);
		})
		it('should return 403 if higher authurity required', async () => {
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send(sendBody)
				.set('x-auth-token', notAdminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(403);
		})
	})
	describe('POST /new', () => {
		it('should return 200 if upload image success', async () => {
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send(sendBody)
				.set('x-auth-token', adminToken);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.merchid == merch1._id).toBeTruthy();
			expect(res.body.image).toMatchObject({
				data: expect.any(Array),
				type: 'Buffer'
			})
		})
		it('should return 404 if the merch id of the image has not found', async () => {
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send({
					...sendBody,
					merchid: getMock.id()
				})
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
		it('should return 400 if the merchid of the image is invalid', async () => {
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send({
					...sendBody,
					merchid: 'invalidmerchidmudamudamudamudamuda'
				})
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
		it('should return 400 if image is invalid', async () => {
			const res = await request(server)
				.post(`${endPoint}/new`)
				.send({
					...sendBody,
					image: { notAbuffer: 123123123 }
				})
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
	})
	describe('DELETE /merchid/:id', () => {
		it('should return 200 if image delete success', async () => {
			const res = await request(server)
				.delete(`${endPoint}/merchid/${merch2._id}`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.merchid == merch2._id).toBeTruthy();
			expect(res.body.image).toMatchObject({
				data: expect.any(Array),
				type: 'Buffer'
			})
		})
		it('should return 400 if merchid of the image is invalid', async () => {
			const res = await request(server)
				.delete(`${endPoint}/merchid/mudamudamudamudamudamudamuda`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
		it('should return 404 if merchid of the image has not found', async () => {
			const res = await request(server)
				.delete(`${endPoint}/merchid/${getMock.id()}`)
				.set('x-auth-token', adminToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
	})
})