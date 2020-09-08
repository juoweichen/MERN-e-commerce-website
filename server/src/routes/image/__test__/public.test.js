const request = require('supertest');

const db = require('../../../utils/test/dbHandler');
const insert = require('../../../utils/test/insert');
const getMock = require('../../../utils/test/getMock');

const endPoint = '/api/image/public';

describe(`${endPoint}`, () => {
	let server;
	let image1, image2;

	beforeAll(async () => await db.connect());

	beforeEach(async () => {
		server = require('../../../../server');
		image1 = await insert.image({ merchid: '123123123123' })
		image2 = await insert.image({ merchid: '234234234234' })
	})

	afterEach(async () => {
		await server.close();
		await db.clearDatabase();
	})

	afterAll(async () => await db.closeDatabase());

	describe('GET /merchid/:id', () => {
		it('should return 200 if read image success', async () => {
			const res = await request(server)
				.get(`${endPoint}/merchid/${image1.merchid}`)
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.merchid).toEqual(image1.merchid);
			expect(res.body.image).toEqual({
				"data": [0, 0, 0, 0, 0],
				"type": "Buffer"
			});
		})
		it('should return 404 if the image of merchid does not exist', async () => {
			const res = await request(server)
				.get(`${endPoint}/merchid/${getMock.id()}`)
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
		it('should return 400 if the merchid is not invalid', async () => {
			const res = await request(server)
				.get(`${endPoint}/merchid/invalidmerchidblahblahgblah`)
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
	})
})