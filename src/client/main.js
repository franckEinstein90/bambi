"use strict"; 
/****************************************************
 * Application Entry point
 * 
 ****************************************************/
const bambi = require('../bambi.js').bambi;
const errors = require('../errors.js').errors;
const confluencePage = require('./confluencePage').confluencePage
const pageContainer = require('./pageContainer.js').pageContainer; 


AJS.toInit(function($) {
    /*********************************************
     *
     * *******************************************/
   jQuery.extend({
        getValues: function(url) {
            var result = null;
            jQuery.ajax({
                url: url,
                type: 'get',
                async: false,
                success: function(data) {
                    result = data;
                }
            });
            return result;
        }
    })

    let initApp = function(){
        try{
            console.group("Bambi Init")
            bambi.init()
            if(bambi.isProd()){ confluencePage.onReady(confEnv.pageID) }                
            console.groupEnd()
            return true
        }
        catch(err){
            errors.doError({
                title: "bad setup",
                body: "Your calendar install is not set up properly." 
            });
            return false
        }
    }

    if(initApp()){
        pageContainer.onReady();  
    }
 
})

