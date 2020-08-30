const express = require('express');
const app = express();
const path = require('path');

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

// Serve static files from the React frontend app
if (process.env.NODE_ENV === 'production') {
	const clinetPath = path.join(__dirname, '../client/build');
	console.log('Serve client build at: ', clinetPath);
	app.use(express.static(clinetPath))
	// Anything that doesn't match the above, send back index.html
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname + '../client/build/index.html'))
	})
}

// export server for testing
module.exports = server;
