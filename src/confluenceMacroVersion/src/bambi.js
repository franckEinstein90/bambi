const bambi = (function() {
    let runningEnv = undefined;

    return {
        setEnv: function(env) {
            runningEnv = env
        },
	isDev: function(){return runningEnv === bambi.runningEnvs.development;},
        runningEnvs: {
            production: 1,
            development: 2
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
