'use strict';

const express = require('express');
const router = express.Router();
/*******************************************************
 * rest api controllers
 * ****************************************************/
const eventController = require('./eventController.js').eventController;

const helmet = require('helmet');
const exphbs = require('express-handlebars');


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

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


router.get('/about', function(req, res){
	res.send('in about page');
});


router.get('/', function(req, res){
	res.render('home');
});

router.get('/events', eventController.event_list);

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

const newEvent = function(eventTitle){

    MongoClient.connect(url, function(err, db){

    if(err) throw err;
    let dbo = db.db("bambi");
    const myobj = {
        eventName: eventTitle
    };
    dbo.collection("events").insertOne(myobj, function(err, res){
        if(err) throw err;
        console.log("1 document inserted");
        db.close();
    });
  });
}


const fs = require('fs');

router.use(express.json());
router.post('/event/create/*', eventController.create_event);

/*function(req, res){
    let eventTitle = req.body.eventTitle;
    console.log(eventTitle);
    newEvent( eventTitle );
    res.send("hello");
}); */

app.use(router);
app.use(express.static('public/'));
app.listen(PORT, () => console.log(`App listening on *:${PORT}`))




