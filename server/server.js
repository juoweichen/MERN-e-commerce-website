const express = require('express');
const app = express();

console.log('Currenet node environment: ', process.env.NODE_ENV);

// middleware
app.use(express.json());
require('./src/init/cors')(app);

// Routes
const user = require('./src/routes/user');

app.use('/api/user', user);

// Listening to port
const port = process.env.PORT ?
	process.env.PORT :
	(process.env.NODE_ENV === 'test' ? 5001 : 5000);
const server = app.listen(port, () => {
	console.log('listening to port', port);
})

// export server for testing
module.exports = server;
