const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authMW = require('../../middlewares/auth');
const UserModel = require('../../models/user');
const CartModel = require('../../models/cart');
const userValidator = require('../../validators/user');
const errorResponse = require('../../utils/error');

/**
 * Create new cart in db, used before register new user
*/
function createNewCart() {
	try {
		return CartModel.create({});
	}
	catch (ex) {
		console.log(ex);
		return null;
	}
}

/**
 * New user register, repeat email is not allowed
 * Create a new cart if register successed
 * @req - body: {name, email, password, password2}
 * @res - header: {jwt token} x-auth-token
 * 		  - body: new user info
 */
router.post('/register', async function (req, res) {
	// if post format is invalid
	const { error } = userValidator.register(req.body);
	if (error)
		return res.status(400).send(errorResponse(error.details[0].message));
	// if user is already register
	const registeredEmail = await UserModel.findOne({ email: req.body.email })
	if (registeredEmail)
		return res.status(400).send(errorResponse("Email already registered"));
	// Create a new cart
	const newCart = await createNewCart();
	if (!newCart)
		return res.status(500).send(errorResponse('Unable to create a new cart'));
	// create new user, crypt user password
	const newUser = {
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		cartid: newCart._id
	}
	const salt = await bcrypt.genSalt(10);
	newUser.password = await bcrypt.hash(newUser.password, salt);
	// Generate token
	const token = jwt.sign(newUser, process.env.JWT_PRIVATE_KEY);
	// create documents in db
	UserModel.create(newUser)
		.then(result => res.status(200)
			.header('x-auth-token', token)
			.header("access-control-expose-headers", "x-auth-token")
			.send(result))
		.catch(error => res.status(422).send(errorResponse(error)));
})

/**
 * User login
 * @req - body: {password, email}
 * @res - header: {jwt token} x-auth-token
 * 		  - body: login user info
 */
router.post('/login', async function (req, res) {
	// validate login body
	const { error } = userValidator.login(req.body);
	if (error)
		return res.status(400).send(errorResponse(error.details[0].message));
	// find user
	const user = await UserModel.findOne({ email: req.body.email });
	if (!user)
		return res.status(404).send(errorResponse("incorrect email or password"));
	// verify password
	if (!bcrypt.compareSync(req.body.password, user.password))
		return res.status(401).send(errorResponse('incorrect email or password'));
	// generate token
	const token = jwt.sign(user.toObject(), process.env.JWT_PRIVATE_KEY);
	// send token
	res.status(200)
		.header('x-auth-token', token)
		.header("access-control-expose-headers", "x-auth-token")
		.send(user);
})

/**
 * Verify localstorage jwt, authMW will verify is token valid
 * We need to verify if user is exist in db
 * @req - header: x-auth-token with user level authentication
 * @res - header: same x-auth-token
 * 			- body: user data
 */
router.get('/verify', [authMW], async (req, res) => {
	UserModel.findById(req.user._id, (err, user) => {
		if (err) return res.status(500).send(errorResponse(err));
		if (!user) return res.status(404).send(errorResponse('jwt user not exist'));
		res.status(200)
			.header('x-auth-token', req.header('x-auth-token'))
			.header("access-control-expose-headers", "x-auth-token")
			.send(req.user)
	})
})

module.exports = router;