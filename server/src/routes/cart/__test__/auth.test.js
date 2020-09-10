const request = require('supertest');

const db = require('../../../utils/test/dbHandler');
const insert = require('../../../utils/test/insert');
const getMock = require('../../../utils/test/getMock');
const calculateTotal = require('../../../utils/cart');

const endPoint = '/api/cart/auth';

let category1, category2;
let merch1, merch2, merch3;
let items, cart;
let total;

async function insertTestDd(cartid) {
	// insert test categories
	category1 = await insert.category({ name: 'Outfit' })
	category2 = await insert.category({ name: 'Shoes' })
	// insert test merchs
	merch1 = await insert.merch({ name: 'Jeans', category: category1, price: 33.99, description: 'just a regular jeans' });
	merch2 = await insert.merch({ name: 'Sneakers', category: category2, price: 45.99, description: 'A cool looking sneakers' });
	merch3 = await insert.merch({ name: 'Shirt', category: category1, price: 12.99, description: 'A regular shirt' });
	// insert test cart
	items = [
		insert.cartItem({ merch: merch1, amount: 2 }),
		insert.cartItem({ merch: merch2, amount: 1 }),
	]
	cart = await insert.cart(cartid, items)
	total = calculateTotal(items);
}

describe(`${endPoint}`, () => {
	let server;
	let user = {
		name: 'user1',
		email: 'user1@gmail.com',
		password: '123123',
		cartid: getMock.id()
	}
	let userToken;

	beforeAll(async () => await db.connect());

	beforeEach(async () => {
		server = require('../../../../server');
		// get user token
		userToken = getMock.jwt(user);
		// Create mock db
		await insertTestDd(user.cartid);
	})

	afterEach(async () => {
		await server.close();
		await db.clearDatabase();
	})

	afterAll(async () => await db.closeDatabase());

	describe('Authentication', () => {
		it('Should return 401 if token has not provided', async () => {
			// Test with GET /api/cart/auth/:id
			const res = await request(server)
				.get(`${endPoint}/${user.cartid}`)
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(401);
		})
		it('Should return 498 if token is invalid', async () => {
			// Test with GET /api/cart/auth/:id
			const res = await request(server)
				.get(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', 'nonsencetokenstringreallydoesntmeansany');
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(498);
		})
	})

	describe('GET /:id', () => {
		it('should return 200 if read cart content success', async () => {
			const res = await request(server)
				.get(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.items).toHaveLength(2);
			expect(res.body.totalAmount).toBe(total.amount);
			expect(res.body.totalPrice).toBeCloseTo(total.price);
		})
		it('should return 404 if cart id not found', async () => {
			const res = await request(server)
				.get(`${endPoint}/${getMock.id()}`)
				.set('x-auth-token', userToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
		it('should return 400 if cart id is invalid', async () => {
			const res = await request(server)
				.get(`${endPoint}/aninvalidcartid123123123123`)
				.set('x-auth-token', userToken);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
	})
	describe('PUT /:id - add items to cart', () => {
		let sendCartItem;

		beforeEach(() => {
			sendCartItem = insert.cartItem({ merch: merch3, amount: 3 });
		})

		it('should return 200 if add a new items to cart success', async () => {
			const res = await request(server)
				.post(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken)
				.send(sendCartItem);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.items).toHaveLength(cart.items.length + 1);
			expect(res.body.totalAmount).toBe(total.amount + sendCartItem.amount);
			expect(res.body.totalPrice).toBeCloseTo(total.price + sendCartItem.subTotalPrice);
		})
		it('should return 200 if add amount to an existed items in cart success', async () => {
			sendCartItem = insert.cartItem({ merch: merch1, amount: 2 }); // Add two more merch1, merch 1 should has 4 now
			const res = await request(server)
				.post(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken)
				.send(sendCartItem);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.items).toHaveLength(cart.items.length);
			expect(res.body.totalAmount).toBe(total.amount + sendCartItem.amount);
			expect(res.body.totalPrice).toBeCloseTo(total.price + sendCartItem.subTotalPrice);
		})
		it('should return 400 if cart id is an invalid id', async () => {
			const res = await request(server)
				.post(`${endPoint}/aninvalidcartid123123123123`)
				.set('x-auth-token', userToken)
				.send(sendCartItem);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
		it('should return 404 if cart id has not found', async () => {
			const res = await request(server)
				.post(`${endPoint}/${getMock.id()}`)
				.set('x-auth-token', userToken)
				.send(sendCartItem);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
		it('should return 400 if request body is invalid', async () => {
			const res = await request(server)
				.post(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken)
				.send({
					...sendCartItem,
					amount: 11 // allow maximum amount 10
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
		it('should return 400 if mercd id in request body is an invalid id', async () => {
			const res = await request(server)
				.post(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken)
				.send({
					...sendCartItem,
					merchid: 'poiuygtoljhjklkjhghjkjhjklkjh'
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
		it('should return 404 if mercd id in request body is not exist in db', async () => {
			const res = await request(server)
				.post(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken)
				.send({
					...sendCartItem,
					merchid: getMock.id()
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
		it('should return 409 if a merch amount would be more then 10', async () => {
			// Used to have 2, add 9 more, merch 1 should exceed 10 now
			sendCartItem = insert.cartItem({ merch: merch1, amount: 9 });
			const res = await request(server)
				.post(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken)
				.send(sendCartItem);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(409);
		})
		it('should return 409 if cart full with 10 merchs', async () => {
			// Clear default test db
			await db.clearDatabase()
			// Create fake cart with 10 kinds of merchs
			let fakeCategory = await insert.category({ name: 'Outfit' })
			let fakeMerch, fakeCart;
			let bigItems = []
			for (let i = 0; i < 10; i++) {
				fakeMerch = await insert.merch({ name: `fakeMerch${i}`, category: fakeCategory, price: 4.44, description: 'fake fake fake' });
				bigItems.push(insert.cartItem({ merch: fakeMerch, amount: 2 }))
			}
			fakeCart = await insert.cart(user.cartid, bigItems);
			// make one more fakeMerch10 to add in cart
			fakeMerch = await insert.merch({ name: 'fakeMerch10', category: fakeCategory, price: 4.44, description: 'fake fake fake' });
			sendCartItem = insert.cartItem({ merch: fakeMerch, amount: 2 })
			// Call api
			const res = await request(server)
				.post(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken)
				.send(sendCartItem);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(409);
		})
	})
	describe('PUT /:id - update whole cart', () => {
		let sendItems, sendTotal, sendCart;

		beforeEach(() => {
			sendItems = [
				insert.cartItem({ merch: merch2, amount: 3 }),
				insert.cartItem({ merch: merch3, amount: 2 }),
				insert.cartItem({ merch: merch1, amount: 4 })
			];
			sendTotal = calculateTotal(sendItems);
			sendCart = {
				totalAmount: sendTotal.amount,
				totalPrice: sendTotal.price,
				items: sendItems
			}
		})

		it('should return 200 if update cart success', async () => {
			const res = await request(server)
				.put(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken)
				.send(sendCart);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.items).toHaveLength(sendItems.length);
			expect(res.body.totalAmount).toBe(sendTotal.amount);
			expect(res.body.totalPrice).toBeCloseTo(sendTotal.price);
		})
		it('should return 404 if cart id not found', async () => {
			const res = await request(server)
				.put(`${endPoint}/${getMock.id()}`)
				.set('x-auth-token', userToken)
				.send(sendCart);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
		it('should return 400 if cart id is invalid', async () => {
			const res = await request(server)
				.put(`${endPoint}/asdfgfdsasdfgfdsdfgfdsasdfdsa`)
				.set('x-auth-token', userToken)
				.send(sendCart);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
		it('should return 400 if req body is invalid', async () => {
			const res = await request(server)
				.put(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken)
				.send({
					...sendCart,
					totalAmount: 12.5, // should be integar
				});
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
	})
	describe('DELETE /:id - delete cart item', () => {
		let sendDelete;

		beforeEach(() => {
			sendDelete = { merchid: merch1._id }
		})

		it('should return 200 if delete cart item success', async () => {
			const res = await request(server)
				.delete(`${endPoint}/${user.cartid}`)
				.set('x-auth-token', userToken)
				.send(sendDelete);
			expect(res.body.error).not.toBeDefined();
			expect(res.status).toBe(200);
			expect(res.body.items).toHaveLength(cart.items.length - 1);
			expect(res.body.totalAmount).toBe(total.amount - cart.items[0].amount);
			expect(res.body.totalPrice).toBeCloseTo(total.price - cart.items[0].subTotalPrice);
		})
		it('should return 404 if cart id not found', async () => {
			const res = await request(server)
				.delete(`${endPoint}/${getMock.id()}`)
				.set('x-auth-token', userToken)
				.send(sendDelete);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(404);
		})
		it('should return 400 if cart id is invalid', async () => {
			const res = await request(server)
				.delete(`${endPoint}/lkjhgfdfghjklkjhgfghjkljhyghuiuytg`)
				.set('x-auth-token', userToken)
				.send(sendDelete);
			expect(res.body.error).toBeDefined();
			expect(res.status).toBe(400);
		})
	})
})