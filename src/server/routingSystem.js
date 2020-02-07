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
const appRoot = require('@routes/appRoot').appRoot
/*****************************************************************************/

const routingSystem = function({
    app
    }){

        let _router = require('express').Router() 
        app.use('/', _router)
        _router.get('/', appRoot.render)

        return {


        } 
}


module.exports = {
    routingSystem
}
