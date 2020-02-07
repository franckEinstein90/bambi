"use strict"; 
/****************************************************
 * Application Entry point
 * 
 ****************************************************/
const bambi = require('../bambi').bambi;
const pageContainer = require('./pageContainer').pageContainer


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
    });

    let initApp = function(){
        try{
            console.group("Bambi Init");
                bambi.init()
                if(bambi.isProd()){ confluencePage.onReady(confEnv.pageID) }   
                pageContainer.ready();  
            console.groupEnd()
            return true
        }
        catch(err){
            errors.doError({
                title: "bad setup",
                body: "Your calendar install is not set up properly." 
            });
            return false;
        }
    };

    if(initApp()){
        try{
            bambi.run()
        }
        catch(err){
            errors.doError(err)
        }
    }
 
});