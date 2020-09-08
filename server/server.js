const express = require('express');
const app = express();
const path = require('path');

// init
app.use(express.json());
require('./src/init/env')();	// check env variable
require('./src/init/cors')(app);
if (process.env.NODE_ENV !== 'test')
	require('./src/init/db')();
console.log('Currenet node environment: ', process.env.NODE_ENV);

// Routes
const user = require('./src/routes/user');
const category = require('./src/routes/category');
const merch = require('./src/routes/merch');
const image = require('./src/routes/image');

app.use('/api/user', user);
app.use('/api/category', category);
app.use('/api/merch', merch);
app.use('/api/image', image);

// Listening to port
const port = process.env.PORT ?
	process.env.PORT :
	(process.env.NODE_ENV === 'test' ? 5001 : 5000);
const server = app.listen(port, () => {
	console.log('listening to port', port);
})

// Serve static files from the React frontend app
// if (process.env.NODE_ENV === 'production') {
const clinetPath = path.join(__dirname, '/../client/build');
console.log('Serve client build at: ', clinetPath);
app.use(express.static(clinetPath))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/../client/build/index.html'))
})
// }

// export server for testing
module.exports = server;
