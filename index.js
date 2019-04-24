'use strict';

const express = require('express');
const helmet = require('helmet');
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

const scheduler = require('./src/scheduler').scheduler;
router.get('/scheduler', function(req, res){
scheduler.setValues([1,15,10,13,16]);
        let max = scheduler.calculated(0,4);
 
	res.send('in about page');
});


router.get('/about', function(req, res){
	res.send('in about page');
});


router.get('/', function(req, res){
	res.render('home');
});

app.use(router);
app.use(express.static('public/'));
app.listen(PORT, () => console.log(`App listening on *:${PORT}`))




