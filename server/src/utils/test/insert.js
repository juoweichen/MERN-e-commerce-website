const bcrypt = require('bcrypt');

const UserModel = require('../../models/user');
const CategoryModel = require('../../models/category');
const MerchModel = require('../../models/merch');
const CartModel = require('../../models/cart');
const ImageModel = require('../../models/image');

const getMock = require('./getMock');
const calculateTotal = require('../cart');

async function insertTestUser({ username, password, email }) {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const newUser = new UserModel({
		username: username,
		password: hashedPassword,
		email: email
	})
	await UserModel.collection.insertOne(newUser);
	return newUser;
}

async function insertTestCategory({ name }) {
	const newCategory = new CategoryModel({
		name: name
	})
	await CategoryModel.collection.insertOne(newCategory);
	return newCategory;
}

async function insertTestMerch({ name, category, price, description }) {
	const newMerch = new MerchModel({
		name: name,
		category: category,
		price: price,
		description: description
	})
	await MerchModel.collection.insertOne(newMerch);
	return newMerch;
}

/**
 * Only return an object of cart item
 */
function getTestCartItem({ merch, amount }) {
	return {
		merchid: merch._id,
		name: merch.name,
		price: merch.price,
		amount,
		subTotalPrice: merch.price * amount
	}
}

async function insertTestCart(cartid, items) {
	const total = calculateTotal(items);
	const newCart = new CartModel({
		_id: cartid,
		totalAmount: total.amount,
		totalPrice: total.price,
		items
	})
	await CartModel.collection.insertOne(newCart);
	return newCart;
}

async function insertTestImage({ merchid }) {
	const newImage = new ImageModel({
		merchid,
		image: [0, 0, 0, 0, 0]
	})
	await ImageModel.collection.insertOne(newImage);
	return newImage;
}

module.exports = {
	user: insertTestUser,
	category: insertTestCategory,
	merch: insertTestMerch,
	cart: insertTestCart,
	cartItem: getTestCartItem,
	image: insertTestImage,
}