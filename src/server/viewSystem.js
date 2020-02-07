/*******************************************************************************
 * Bambi - Dynamic autonomous event system - By FranckEinstein90
 * ----------------------------------------------------------------------------
 * ----------------------------------------------------------------------------
 * viewSystem.js - uses express handlebars, view templates are stored 
 * in ./views 
 /*****************************************************************************/
"use strict"

/*****************************************************************************/
const hbs = require('express-handlebars')
/*****************************************************************************/

const viewSystem = function({
    app, 
    root, 
    layoutsDir, 
    partialsDir
    }) {
    
        app.engine('hbs', hbs({
            extname        : 'hbs', 
            defaultLayout  : 'main', 
            layoutsDir, 
            partialsDir
        }))
        
        app.set('view engine', 'hbs')
}

module.exports = {
    viewSystem
}


