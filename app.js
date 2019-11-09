'use strict';
require('module-alias/register')


const express = require('express')
const path = require('path')
const indexRouter = require('@routes/index')


const router = express.Router();
/*******************************************************
 * rest api controllers
 * ****************************************************/
const eventController = require('./eventController.js').eventController;

const helmet = require('helmet');
const exphbs = require('express-handlebars');


const PORT = process.env.PORT || 3000;
const app = express();




let initServer = function(){
    app.use(express.json());
    app.use(express.urlencoded({extended:false}));


    /*View engine setup************************************/
    let hbs = exphbs.create({
        defaultLayout: 'main', 
        partialsDir: [
            'views/partials'
        ]
    });
    app.engine('handlebars', hbs.engine)
    app.set('view engine', 'handlebars')

    app.use(express.static(path.join(__dirname, 'public/')))
    app.use('/', indexRouter)
    app.use(function(req, res, next){
      next(createError(404))
    })
}

initServer()


module.exports = app

