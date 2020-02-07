/*******************************************************************************
 * Bambi - Dynamic autonomous event system - By FranckEinstein90
 * ----------------------------------------------------------------------------
 * Started in 2018 
 * Last Update Feb 2020
 * ----------------------------------------------------------------------------
 * this is the entry point - boots the app, starts the server, sets the status
 /*****************************************************************************/
"use strict"

/********************** top level includes ************************************/
require('module-alias/register')
/*********************** npm libraries ****************************************/
const path = require('path')
/*********************** code from this rep (in src) **************************/
const appData   = require('@appInternals/appData').appData
const bambiApp  = require('@appInternals/app').ready()

const expressStack  = require('@server/expressStack').expressStack({
    root        : __dirname, 
    staticFolder: path.join( __dirname, 'public'), 
    faviconPath : null 
})
bambiApp.say('expressStack ok')
require('@server/routingSystem').routingSystem({
    app: expressStack.app
})
bambiApp.say('routingSystem ok')
require('@server/httpServer').httpServer({
    app : expressStack.app, 
    port: '3000' 
})
bambiApp.say('httpServer ok')


/******************************************************************************/
//everything is set up!!! let's boot :)
bambiApp.run()





