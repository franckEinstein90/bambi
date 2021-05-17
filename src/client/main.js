"use strict"; 
/****************************************************
 * Application Entry point
 * Client side
 ****************************************************/
const bambi = require('../bambi').bambi;

/*AJS is the AUI version of jquery*/
AJS.toInit(function($) {
    
   const appInit = bambi.init() ;  
   if( initApp ) bambi.run() ; 

});