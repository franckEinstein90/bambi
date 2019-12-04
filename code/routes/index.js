const express = require('express')
const router = express.Router()


router.get('/about', function(req, res){
	res.send('in about page');
});


router.get('/', function(req, res){
	res.render('home');
});



module.exports = router 
