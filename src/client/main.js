"use strict"; 
/****************************************************
 * Application Entry point
 * 
 ****************************************************/
const bambi = require('../bambi.js').bambi;
const errors = require('../errors.js').errors;
const pageContainer = require('./pageContainer.js').pageContainer; 

AJS.toInit(function($) {
    /*********************************************
     *
     * *******************************************/
    console.log("App Start");
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

    bambi.init();
    if (!bambi.goodEnv()) {
        errors.doError({
            title: "bad setup",
            body: "Your calendar install is not set up properly." +
                  " Please contact the Confluence team to resolve this issue and get your calendar properly initialize"
        });
    }
    else{
        bambi.setEnv();
        /**********************************************************************
         * if this is running in a confluence environemnt, bambi expects the 
         * variable "confEnv" to be defined
         * ************************************************************************/
       
        if(! bambi.isDev()){ 
            try {
                confluencePage.onReady(confEnv.pageID);
            } catch (err) {
                console.log(err);
            }
        }
        pageContainer.onReady();
    }
});

