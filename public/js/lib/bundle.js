(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
  "version": {
    "major": 1,
    "minor": 3,
    "patch": 0
  },
  "status": {
    "stage": null,
    "number": 0
  },
  "build": {
    "date": null,
    "number": 0,
    "total": 0
  },
  "commit": null,
  "config": {
    "appversion": "1.7.1",
    "markdown": [],
    "json": [],
    "ignore": []
  }
}

},{}],2:[function(require,module,exports){
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

        run: function(){

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

},{"../appversion.json":1}],3:[function(require,module,exports){
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
},{"../bambi":2,"./pageContainer":4}],4:[function(require,module,exports){
"use strict";
/******************************
 * Includes all initialization functions
 * ***************************/



const bambi = require('../bambi.js').bambi 



const pageContainer = (function() {

    return {
        ready(){

        }
    }
})()

module.exports = {
    pageContainer
}

},{"../bambi.js":2}]},{},[3]);
