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
require('module-alias/register')
/*****************************************************************************/

const appData       = require('@appInternals/appData').appData
const expressStack  = require('@server/expressStack').expressStack({
    root: __dirname
})
