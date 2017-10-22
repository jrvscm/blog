const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//add some blog posts so we can see some data
BlogPosts.create(
				'Best American Ales',`Disrupt typewriter minim affogato, small batch hammock hell of paleo 
				everyday carry whatever adipisicing occupy swag dolor. Lyft literally listicle, 3 wolf moon 
				portland cliche deep v PBR&B austin biodiesel asymmetrical keffiyeh. Vape quinoa scenester 
				shoreditch hell of chartreuse sunt typewriter gluten-free neutra gastropub brooklyn ut. 
				Mlkshk sed dolor, bitters truffaut officia williamsburg chicharrones succulents selvage 
				hammock ugh adaptogen aute taiyaki. Lo-fi ramps marfa, whatever master cleanse sed palo 
				santo vexillologist yuccie literally cornhole dreamcatcher exercitation nostrud. Sint hot 
				chicken dolore gentrify, tattooed narwhal occupy cloud bread ipsum lo-fi. Shabby chic 
				succulents health goth direct trade. Synth mlkshk dolor subway tile before they sold out 
				deserunt everyday carry proident letterpress butcher post-ironic woke vinyl dreamcatcher. Banjo 
				organic cliche wolf swag, waistcoat raw denim chambray man bun vice microdosing voluptate aliqua 
				bespoke. Beard XOXO kickstarter, fashion axe waistcoat bicycle rights 3 wolf moon raclette 
				freegan nisi pug lyft. Organic meh synth live-edge edison bulb etsy small batch cold-pressed 
				ugh fanny pack trust fund raw denim prism.
				Oh. You need a little dummy text for your mockup? How quaint.`, 'Hipster Rick', '09/04/2017');
BlogPosts.create(
				'Best Pilsner',`Disrupt typewriter minim affogato, small batch hammock hell of paleo 
				everyday carry whatever adipisicing occupy swag dolor. Lyft literally listicle, 3 wolf moon 
				portland cliche deep v PBR&B austin biodiesel asymmetrical keffiyeh. Vape quinoa scenester 
				shoreditch hell of chartreuse sunt typewriter gluten-free neutra gastropub brooklyn ut. 
				Mlkshk sed dolor, bitters truffaut officia williamsburg chicharrones succulents selvage 
				hammock ugh adaptogen aute taiyaki. Lo-fi ramps marfa, whatever master cleanse sed palo 
				santo vexillologist yuccie literally cornhole dreamcatcher exercitation nostrud. Sint hot 
				chicken dolore gentrify, tattooed narwhal occupy cloud bread ipsum lo-fi. Shabby chic 
				succulents health goth direct trade. Synth mlkshk dolor subway tile before they sold out 
				deserunt everyday carry proident letterpress butcher post-ironic woke vinyl dreamcatcher. Banjo 
				organic cliche wolf swag, waistcoat raw denim chambray man bun vice microdosing voluptate aliqua 
				bespoke. Beard XOXO kickstarter, fashion axe waistcoat bicycle rights 3 wolf moon raclette 
				freegan nisi pug lyft. Organic meh synth live-edge edison bulb etsy small batch cold-pressed 
				ugh fanny pack trust fund raw denim prism.
				Oh. You need a little dummy text for your mockup? How quaint.`, 'Hipster Joe', '10/05/2017');
BlogPosts.create(
				'Best IPA of All Time',`Disrupt typewriter minim affogato, small batch hammock hell of paleo 
				everyday carry whatever adipisicing occupy swag dolor. Lyft literally listicle, 3 wolf moon 
				portland cliche deep v PBR&B austin biodiesel asymmetrical keffiyeh. Vape quinoa scenester 
				shoreditch hell of chartreuse sunt typewriter gluten-free neutra gastropub brooklyn ut. 
				Mlkshk sed dolor, bitters truffaut officia williamsburg chicharrones succulents selvage 
				hammock ugh adaptogen aute taiyaki. Lo-fi ramps marfa, whatever master cleanse sed palo 
				santo vexillologist yuccie literally cornhole dreamcatcher exercitation nostrud. Sint hot 
				chicken dolore gentrify, tattooed narwhal occupy cloud bread ipsum lo-fi. Shabby chic 
				succulents health goth direct trade. Synth mlkshk dolor subway tile before they sold out 
				deserunt everyday carry proident letterpress butcher post-ironic woke vinyl dreamcatcher. Banjo 
				organic cliche wolf swag, waistcoat raw denim chambray man bun vice microdosing voluptate aliqua 
				bespoke. Beard XOXO kickstarter, fashion axe waistcoat bicycle rights 3 wolf moon raclette 
				freegan nisi pug lyft. Organic meh synth live-edge edison bulb etsy small batch cold-pressed 
				ugh fanny pack trust fund raw denim prism.
				Oh. You need a little dummy text for your mockup? How quaint.`, 'Hipster Mike', '10/18/2017');


//when a get request is called, return the blog posts
router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}

	const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(post);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post \`${req.params.id}\``);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req,res) => {
	const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
	for(let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(Message);
		}
	}

	if (req.params.id !== req.body.id) {
		const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blogposts item \`${req.params.id}\``);
	const updatedPost = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();
})

module.exports = router;