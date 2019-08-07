/************************************************
 * bambi.js
 * Global app settings
 * FranckEinstein90
 ***********************************************/
"use strict";

const bambi = (function() {
	/*************** variable definitions *************/
	let validEnv,  //Env related variables
		eventSectionDefinition;
	/**************************************************/
	validEnv = false; 
	eventSectionDefinition = {
		beginLabel: "[***BEGIN CALENDAR EVENTS***]",
		endLabel:"[***END CALENDAR EVENTS***]"
	};

    return {
        init: function() {
			let checkEventSection = AJS.$("h1:contains('Events')").length > 0;
			if(!checkEventSection){
				validEnv = false; 
				return; 
			}
			checkEventSection = AJS.$("h1:contains('Events')").next('UL').length > 0; 
			if(!checkEventSection){
				validEnv = false; 
				return; 
			}
			validEnv = true; 
        },
        runningEnvs: {
            production: 1,
            development: 2
        },
        setEnv: function(env) { //captures the running environment
            runningEnv = env;
        },
        isDev: function() { //returns true for a dev env
            return runningEnv === bambi.runningEnvs.development;
        },
        user: {
            language: "en"
        },
        clientData: {
            "monthsEn": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "monthsFr": ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"],
            "weekDaysAbbrEn": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            "weekDaysAbbrFr": ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            "weekDays": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        },
        path: (moduleName) => `./${moduleName}`
    }
})();

module.exports = {
    bambi
};