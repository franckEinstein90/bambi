const bambi = (function(){

    return{
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
		language:"en"
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
