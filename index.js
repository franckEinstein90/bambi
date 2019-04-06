'use strict'

const express = require('express');
const exphbs = require('express-handlebars');


const PORT = process.env.PORT || 3000;
const app = express();


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//app.use(express.static('public'));


app.get('/', function(req, res){
	res.render('home');
//	res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen(PORT, () => console.log(`App listening on *:${PORT}`))
