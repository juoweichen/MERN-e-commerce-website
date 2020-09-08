const request = require('supertest');

const db = require('../../../utils/test/dbHandler');
const insert = require('../../../utils/test/insert');
const getMock = require('../../../utils/test/getMock');

const endPoint = '/api/merch/public';

describe(`${endPoint}`, () => {
	let server;
	let category1, category2;
	let merch1, merch2;

	beforeAll(async () => await db.connect())

	beforeEach(async () => {
		server = require('../../../../server');
		category1 = await insert.category({ name: 'Outfit' });
		category2 = await insert.category({ name: 'Shoes' });
		merch1 = await insert.merch({
			name: 'Jeans',
			category: category1,
			price: 20.99,
			description: 'A very comfy jeans'
		})
		merch2 = await insert.merch({
			name: 'Casuel',
			category: category2,
			price: 24.99,
			description: 'A fashion causel'
		})
	})

	afterEach(async () => {
		await server.close();
		await db.clearDatabase();
	})

	afterAll(async () => await db.closeDatabase());

	describe('GET /all', () => {
		it('Should return 200 if get all merch', async () => {
			const res = await request(server)
				.get(`${endPoint}/all`)
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(merch => merch.name === merch1.name)).toBeTruthy();
			expect(res.body.some(merch => merch.category.name === category1.name)).toBeTruthy();
			expect(res.body.some(merch => merch.name === merch2.name)).toBeTruthy();
			expect(res.body.some(merch => merch.category.name === category2.name)).toBeTruthy();
		})
	})

	describe('GET /:id', () => {
		it('should return 200 when find the specific category', async () => {
			const res = await request(server)
				.get(`${endPoint}/${merch1._id}`)
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.name === merch1.name).toBeTruthy();
			expect(res.body.category.name === merch1.category.name).toBeTruthy();
		})
		it('Should return 400 if id is not valid', async () => {
			const res = await request(server)
				.get(`${endPoint}/somerandomshit`)
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
		it('should return 404 if target category id has not found', async () => {
			const res = await request(server)
				.get(`${endPoint}/${getMock.id()}`)
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
	})
})