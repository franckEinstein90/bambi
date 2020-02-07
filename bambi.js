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

require('@server/routingSystem').routingSystem({
    app: expressStack.app
})

require('@server/httpServer').httpServer({
    app : expressStack.app, 
    port: appData.port 
})

/******************************************************************************/
console.log(`app server now running on port ${httpServer.port}`)
bambiApp.run()





