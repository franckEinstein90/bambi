'use strict';

const express = require('express');
const router = express.Router();


const exphbs = require('express-handlebars');


const PORT = process.env.PORT || 3000;
const app = express();

var hbs = exphbs.create({
    defaultLayout: 'main', 
    partialsDir: [
        'views/partials'
    ]
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//routing section
router.use(function(req, res, next){
	console.log(req.method, req.url);
	next();
});
router.get('/', function(req, res){
	res.render('home');
});
router.get('/about', function(req, res){
	res.send('in about page');
});

app.use(router);
app.use(express.static('public/'));
app.listen(PORT, () => console.log(`App listening on *:${PORT}`))
