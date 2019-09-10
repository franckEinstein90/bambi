/************************************************
 * bambi.js
 * Global app settings
 * FranckEinstein90
 ***********************************************/
"use strict";

const appVersion = require('../appversion.json')

const bambi = (function() {
    let bambiVersion,
        checkEnv, setEnv, runningEnv, //Env related variables
        params,
        eventSection;

    bambiVersion = {
        major: appVersion.version.major,
        minor: appVersion.version.minor
    }

    checkEnv = false;
    setEnv = function(env) {
        if (env === bambi.runningEnvs.production) {
            runningEnv = env;
            AJS.populateParameters();
            params = AJS.params;
        } else if (env === bambi.runningEnvs.development) {
            runningEnv = env;
        } else {
            throw "unknown environment"
        }
    };
    eventSection = {
        beginLabel: "[***BEGIN CALENDAR EVENTS***]",
        endLabel: "[***END CALENDAR EVENTS***]"
    };

    return {
        goodEnv: function() {
            return checkEnv;
        },
        init: function() {
            /********************************
             * Get the version number
             ********************************/
            let checkEventSection = AJS.$("h1:contains('Events')").length > 0;
            if (!checkEventSection) {
                checkEnv = false;
                return;
            }
            checkEventSection = AJS.$("h1:contains('Events')").next("UL").length > 0;
            if (!checkEventSection) {
                checkEnv = false;
                return;
            }
            let check2 = AJS.$("h1:contains('Events')").next("UL").children().filter(":last");
            let check3 = check2.text();
            if (check3 === "init" || check3 === eventSection.endLabel) {
                checkEnv = true;
            } else {
                checkEnv = false;
            }
        },
        setEnv: function() {
            /**********************************************************************
             * if this is running in a confluence environemnt, bambi expects the 
             * variable "confEnv" to be defined externally
             * ************************************************************************/
            try{
                if (confEnv in window) { //check if this is a confluence env
                    setEnv(bambi.runningEnvs.production); //this is a production env
                } 
             }
            catch(e){
                setEnv(bambi.runningEnvs.development); // this is a local development envi
            }
        },
        isDev: function() {
            return runningEnv === bambi.runningEnvs.development;
        },
        runningEnvs: {
            production: 1,
            development: 2
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
