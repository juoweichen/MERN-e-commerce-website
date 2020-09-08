const request = require('supertest');

const db = require('../../../utils/test/dbHandler');
const insert = require('../../../utils/test/insert');
const getMock = require('../../../utils/test/getMock');

const endPoint = '/api/category/public';

describe(`${endPoint}`, () => {
	let server;
	let category1, category2, category3;

	beforeAll(async () => await db.connect())

	beforeEach(async () => {
		server = require('../../../../server');
		category1 = await insert.category({ name: 'Outfit' });
		category2 = await insert.category({ name: 'Shoes' });
		category3 = await insert.category({ name: 'Hat' });
	})

	afterEach(async () => {
		await server.close();
		await db.clearDatabase();
	})

	afterAll(async () => await db.closeDatabase());

	describe('GET /all', () => {
		it('Should return 200 if read all categories', async () => {
			const res = await request(server)
				.get(`${endPoint}/all`)
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(3);
			expect(res.body.some(category => category.name === 'Outfit')).toBeTruthy();
			expect(res.body.some(category => category.name === 'Shoes')).toBeTruthy();
			expect(res.body.some(category => category.name === 'Hat')).toBeTruthy();
		})
	})

	describe('id required routes', () => {
		it('Should return 400 if id is not valid', async () => {
			const res = await request(server)
				.get(`${endPoint}/somerandomshit`)
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})

		describe('GET /:id', () => {
			it('should return 200 when find the specific category', async () => {
				const res = await request(server)
					.get(`${endPoint}/${category1._id}`)
				expect(res.body.error).not.toBeDefined();
				expect(res.status).toBe(200);
				expect(res.body.name === 'Outfit').toBeTruthy();
			})
			it('should return 404 if target category id has not found', async () => {
				const res = await request(server)
					.get(`${endPoint}/${getMock.id()}`)
				expect(res.body.error).toBeDefined();
				expect(res.status).toBe(404);
			})
		})
	})
})