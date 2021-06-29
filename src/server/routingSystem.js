/*******************************************************************************
 * Bambi - Dynamic autonomous event system - By FranckEinstein90
 * ----------------------------------------------------------------------------
 * Started in 2018 
 * Last Update Feb 2020
 * ----------------------------------------------------------------------------
 * routingSystem.js is the entry point for the app
 /*****************************************************************************/
"use strict"

/*****************************************************************************/
const express = require('express')
/*****************************************************************************/
const appRoot       = require('@routes/appRoot').appRoot ; 
const accountRouter = require('@routes/account').accountRouter ;
const eventRouter   = require('@routes/events').eventRouter ; 
/*****************************************************************************/

const routingSystem = function({ app }){

        const _router = require('express').Router() ; 
        _router.get('/', appRoot.render) ; 

    
        app.use('/account', accountRouter);
        app.use('/events', eventRouter) ; 
        app.use('/', _router) ; 

        return { } 
} ; 

module.exports = {
    routingSystem
}
