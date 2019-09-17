/************************************************
 * bambi.js
 * Global app settings
 * FranckEinstein90
 ***********************************************/
"use strict";

const appVersion = require('../appversion.json')


const bambi = (function() {
    let bambiVersion,
        dataSectionOK, jqueryOK, 
        runningEnv, detectRunningEnv, //Env related variables
        params,
        eventSection;

    bambiVersion = {
        major: appVersion.version.major,
        minor: appVersion.version.minor
    }

    eventSection = {
        beginLabel: "[***BEGIN CALENDAR EVENTS***]",
        endLabel: "[***END CALENDAR EVENTS***]"
    }

    dataSectionOK = function(){ 
        //verifies that the section that contains data exists and is formatted correctly
        let checkEventSection = AJS.$("h1:contains('Events')").length > 0;
        if (!checkEventSection) {
            return false
        }
        checkEventSection = AJS.$("h1:contains('Events')").next("UL").length > 0;
        if (!checkEventSection) {
            return false
        }
        let check2 = AJS.$("h1:contains('Events')").next("UL").children().filter(":last");
        let check3 = check2.text();
        return (check3 === "init" || check3 === eventSection.endLabel) 
    }

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

        init: function() {
            //check data section exists and correctly formatted
            if(!dataSectionOK()){ throw bambi.error.badInfoSection } 
            runningEnv = detectRunningEnv()
            console.log(`running on ${runningEnv.description}`)
            if(!jqueryOK()){ throw bambi.error.badJQuery }
            if(runningEnv === bambi.runningEnvs.production){
                AJS.populateParameters()
                runningEnv.params = AJS.params
            }
        },

        isProd: function(){
            return runningEnv.code == 1
        }, 

        isDev: function() {
            return runningEnv.code === 2
        },
       
        getVersionString: function() {
            return `Parks Canada Confluence Calendar - v${bambiVersion.major}.${bambiVersion.minor}`
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
