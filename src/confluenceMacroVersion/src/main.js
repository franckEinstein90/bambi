const bambi = require('./bambi').bambi;
const confluencePage = require('./confluencePage').confluencePage;
const pageContainer = require('./pageContainer').pageContainer;

AJS.toInit(function($) {
    /*********************************************/
    console.log("main.js begins");
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


    if (typeof confEnv !== 'undefined') { //check if this is a confluence env
        bambi.setEnv(bambi.runningEnvs.production); //this is a production env
        try {
            confluencePage.onReady(confEnv.pageID);
        } catch (err) {
            console.log(err);
        }
    } else {
        bambi.setEnv(bambi.runningEnvs.development); // this is a local development env
    }
    /*********************************************************************
     * add the section that displays event sidebar ui
     ********************************************************************/
    AJS.$("h1:contains('Events')").before(
        "<div id='eventlist' class='eventList'></div>");

    /*********************************************************************
     * Collects everything that looks like an event description
     * already on the page into an array of strings
     ********************************************************************/
    let eventDescriptions = [];
    AJS.$("h1:contains('Events') + ul li").each(function(index) {
        eventDescriptions.push($(this).text());
    });

    /*********************************************************************
     * inits and sets-up the varous ui elements
     * using array of event description as input
     ********************************************************************/
    pageContainer.onReady(eventDescriptions);
});
