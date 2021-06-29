/******************************************************************************
 *
 * ***************************************************************************/
 "use strict"

const events = require('@events/events').events; 
 /*****************************************************************************/
 /*****************************************************************************/

const getEvents = (req, res, next) =>{
    const eventSpan = {
      from  : +req.params.From, 
      to    : +req.params.To
    }; 
    res.send(`Fetching all events from ${eventSpan.from} to ${eventSpan.to}`) ; 
}; 

const noOperation = (req, res, next) =>{
    res.send(`401`); 
}


const eventRouter = require('express').Router() ; 
eventRouter.get('/:From(\\d+)-:To(\\d+)', getEvents ) ;
eventRouter.get(/.*/, noOperation ) ;

 module.exports = {
    eventRouter
 }
 