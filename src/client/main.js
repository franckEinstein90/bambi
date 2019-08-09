/*****************************************************************************/
const bambi = require('../bambi').bambi;
const pageContainer = require('./pageContainer').pageContainer;


/*****************************************************************************


*****************************************************************************/

AJS.toInit(function($) {

    console.log("App Entry Point");
    bambi.init();
  /*********************************************************************
     * inits and sets-up the varous ui elements
     * using array of event description as input
     ********************************************************************/
    pageContainer.onReady();

});
