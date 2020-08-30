const mongoose = require('mongoose');

module.exports = () => {
	const dbUrl = process.env.DB_URL
	const ops = {
		useNewUrlParser: true,
		useUnifiedTopology: true
	};

	mongoose.set('useFindAndModify', false);
	mongoose.connect(dbUrl, ops)
		.then(res => console.log('MongoDb connect successed, current db:', res.connection.name))
		.catch(err => console.log('MongoDb connect error :(', err));
}
