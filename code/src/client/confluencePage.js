"use strict"; 
/********************************************************
 * client/confluencePage.js
 * Handles environment when env is a confluence page
 *******************************************************/
const bambi = require('../bambi.js').bambi;

const confluencePage = (function() {
   
    return { 
         onReady: function(pageID) {
             if(!bambi.isDev())  _pageID = confEnv.pageID
        },
   }
})()

module.exports = {
    confluencePage
}
