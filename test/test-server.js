const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');


//lets us use should
const should = chai.should();

//allows HTTP requests
chai.use(chaiHttp);

//describe statements

describe('blog', function() {
	
//return runServer to prevent a race dondition so the tests don't run until the server is started	
	before(function() {
		return runServer();
	});

//closes our server for testing modules so the server isn't still running from previous tests, when we do a new test
	after(function() {
		return closeServer();
	});


//test strategy:
//  1. make request to `/blog-posts`
//  2. inspect response object and prove it has the right code and keys in the response object
it('should list blog-posts on GET', function() {
	//we return the promise to chai.request(server).get...
	return chai.request(app)
	.get('/blog-posts')
	.then(function(res) {
		res.should.have.status(200);
		res.should.be.json;
		res.body.should.be.a('array');

		//we create three items on load so...
		res.body.length.should.be.at.least(1);
		//each item should be an object with key/value pairs
		//for `id`, `title`, `author`, `content`, `publishDate`
		const expectedKeys = ['id', 'title', 'author', 'content', 'publishDate'];
		res.body.forEach(function(item) {
			item.should.be.a('object');
			item.should.include.keys(expectedKeys);
		});
	});
});

//test strategy:
//1. make a POST request with data for a new post
//2. inspect response object and prove it has the
//	right status code and that the returned object
//has an `id`

it('should add a post on POST', function() {
	const newPost = {title: "Best Summer Beers",
					content: "Jack the grifter",
					author: "Blah blah blah beers",
					publishDate: "10/20/2016"};
	return chai.request(app)
	.post('/blog-posts')
	.send(newPost)
	.then(function(res) {
		res.should.have.status(201);
		res.should.be.json;
		res.body.should.be.a('object');
		res.body.should.include.keys('title', 'author', 'content', 'publishDate');
		res.body.id.should.not.be.null;
		res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id}));
	});
});


//test strategy:
//1 initialize some data(we don't have an id until a get request is made)
//2 make get request so we can get a post to update
//3 add the id to updatePost
//4 make a put request with updatePost
//5 inspect the response object to ensure it has the right status code
it('should update posts on PUT', function() {
	const updatePost = {
		title: "LOTS OF BEERS",
		author: "Sam Adams",
		content: "beery barley beers wheat beer beer ale beer what?",
		publishDate: "10/18/2016" 
	};
	return chai.request(app)
	//make a get req so we have an ID to update
	.get('/blog-posts')
	.then(function(res) {
		updatePost.id = res.body[0].id;

		return chai.request(app)
		.put(`/blog-posts/${updatePost.id}`)
		.send(updatePost);
	})
	//prove put has the right status code
	.then(function(res) {
		res.should.have.status(204);
	});
});


//test strategy:
//1. get blog posts so we can use an ID to delete
//2. DELETE an item and ensure we get back a status 204

it('should delete items on DELETE', function() {
	return chai.request(app)
	//make a get req so we have an id to delete
	.get('/blog-posts')
	.then(function(res) {
		return chai.request(app)
		.delete(`/blog-posts/${res.body[0].id}`);
	})
	.then(function(res) {
		res.should.have.status(204);
		});
	});
});//describe blog function end --


