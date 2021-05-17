/************************************************
 * bambi.js
 * Global app settings
 * FranckEinstein90
 ***********************************************/
"use strict";

//const appVersion = require('../appversion.json') ; 

const _findPageEvents = ()=> {
    let bambiEvents = AJS.$(".bambiEvent") ;
    return bambiEvents ;  
}

const _findBambiContainers = function(){ 
    //return the bambi containers currently in the DOM
    let bambiContainers = AJS.$(".bambiContainer");
    console.log (bambiContainers) ;  
    //verifies that the section that contains data exists and is formatted correctly
/*    let checkEventSection = AJS.$("h1:contains('Events')").length > 0;
    if ( !checkEventSection ) return false ; 
    checkEventSection = AJS.$("h1:contains('Events')").next("UL").length > 0;
    if (!checkEventSection) { return false }
    let check3 = check2.text();
    return (check3 === "init" || check3 === eventSection.endLabel) */
}


const bambi = ( function() {

    let bambiVersion,
        dataSectionOK, jqueryOK, 
        runningEnv, detectRunningEnv ; 

    let events ; 
    let bambiContainers ; 
 /*   bambiVersion = {
        major: appVersion.version.major,
        minor: appVersion.version.minor
    }*/

    const eventSection = {
        beginLabel: "[***BEGIN CALENDAR EVENTS***]",
        endLabel: "[***END CALENDAR EVENTS***]"
    } ; 

    jqueryOK = function(){
        if(typeof jQuery != 'undefined'){
            console.log(jQuery.fn.jquery)
            return true
        }
        return false
    }

    detectRunningEnv = function() {
        /**********************************************************************
         * if this is running in a confluence environemnt, bambi expects the 
         * variable "confEnv" to be defined externally
         * ************************************************************************/
        try{
            if (confEnv) { //check if this is a confluence env
                return bambi.runningEnvs.production //this is a production env
            } 
         }
        catch(e){
            return bambi.runningEnvs.development // this is a local development envi
        }
    }

    return {
        init: () => {
            bambiContainers = _findBambiContainers() ; 
            events = _findPageEvents(); 
        },
        run: () => {

        }, 

        appStages:{
            init: 5,
            running: 10
        },

        errors:{
            badInfoSection: "bad info section", 
            badJQuery: "bad JQuery" 
        },

        runningEnvs: {
            production: {code: 1, description:"confluence page"},
            development: {code: 2, description: "dev local"}
        },

        isProd: function(){
            return runningEnv.code == 1
        }, 

        isDev: function() {
            return runningEnv.code === 2
        },
       
        getVersionString: function() {
            return ` - v${bambiVersion.major}.${bambiVersion.minor}`
        },

        prevVersion: undefined, //the previous version of the app used to save event and app information
        clientData: {
            "monthsEn": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "monthsFr": ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"],
            "weekDaysAbbrEn": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            "weekDaysAbbrFr": ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            "weekDays": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        },

        htmlFieldSeparator: function(ver) { //returns the field separator corresponding to the version
            if (ver === undefined) {
                return '\\:'
            }
            if (ver === "1.3") {
                return '\\[x\\|\\|\\x\\]'
            }
        },
        path: (moduleName) => `./${moduleName}`
    }
})();

module.exports = {
    bambi
};
