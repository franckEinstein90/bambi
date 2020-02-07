/*******************************************************************************
 * Bambi - Dynamic autonomous event system - By FranckEinstein90
 * ----------------------------------------------------------------------------
 * Started in 2018 
 * Last Update Feb 2020
 * ----------------------------------------------------------------------------
 * bambi.js is not the entry point, but it is the most important chunk of it
 /*****************************************************************************/
"use strict"

/*****************************************************************************/
const express   = require('express')
const path      = require('path')
/*****************************************************************************/

/*****************************************************************************/
const expressStack = function({
    root, 
    staticFolder, 
    faviconPath
    }){

    let _app    = express() 
    let _root   = root
    
    require('@server/viewSystem').viewSystem({
        app         : _app, 
        root        : _root, 
        layoutsDir  : path.join(_root, 'views', 'layouts/'), 
        partialsDir : path.join(_root, 'views', 'partials/')
    })

    _app.use(express.json())
    _app.use(express.urlencoded({
        extended: false
    }))

    _app.use(express.static(staticFolder))
    if( faviconPath ) _app.use(favicon(faviconPath))

    return {
        app: _app
    }
}

module.exports = {
    expressStack
}

