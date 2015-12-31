var express = require('express'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	// passport = require('passport'),
	// LocalStrategy = require('passport-local').Strategy,
	request = require('request'),
	session = require('express-session'),
	User = require('./server-assets/models/user'),
	UserController = require('./server-assets/controllers/userCtrl.js'),
	CartController = require('./server-assets/controllers/cartCtrl.js'),
	MovieController = require('./server-assets/controllers/movieCtrl.js'),
	mongoUri = 'mongodb://localhost:27017/personal-project',
	port = 8080,
	app = express();

mongoose.Promise = require('q').Promise;

app.use(cors(), bodyParser.json(), express.static(__dirname+'/public'), session({
	secret: 'qwoeqeph41923jjaowoiei',
	saveUninitialized: true,
	resave: true
}));

function requireAuth(req, res, next) {
	if (!req.session.user) {
		return res.status(400).end();
	} else {
		next();
	}
};

/* User endpoints */
// Registration
app.post('/api/user', UserController.addUser);

// Login
app.post('/api/login', UserController.loginUser);

// Logout
app.get('/api/logout', function(req, res) {
	req.session.destroy();
	console.log(req.session)
});

/* Cart endpoints */
app.post('/api/cart/:id', requireAuth, CartController.addItem);
app.put('/api/cart/:id', requireAuth, CartController.editCart);
app.delete('/api/cart/:id', requireAuth, CartController.removeItem);

/* Movies endpoints */
app.get('/api/movies', MovieController.getMovies);

app.listen(port, function() {
	console.log('Listening on port:', port);
});

mongoose.connect(mongoUri)
		.connection.once('open', function() {
			console.log('Mongodb connected..');
		});
