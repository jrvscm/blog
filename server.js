const express = require('express');
const morgan = require('morgan');

const app = express();

//sending requests to the blogRouter
const blogRouter = require('./blogRouter');

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

app.use('/blog-posts', blogRouter);

//declaring server so when the server runs it asigns to runServer and closeServer
let server;

//function that starts the server and returns a promise
function runServer() {
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app.listen(port, () => {
			console.log(`Your app is listening on port ${port}`);
			resolve(server);
		}).on('error', err => {
			reject(err)
		});
	});
}


//function to return a promise at close server
function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {
			if (err) {
				reject(err);
				//so we don't also call `resolve()`
				return;
			}
			resolve();
		});
	});
}

//if server.js is called directly this runs. but we also export the runServer command so other code (tests) can start the server as needed.
if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};