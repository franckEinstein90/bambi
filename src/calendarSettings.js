var dateUtils = require('./dateUtils.js').dateUtils;

var calendarSettings = (function (){
	let month = new Date().getMonth(),
	year = new Date().getFullYear();
	return{
    setMonth: function(y, m){
			year = y;
	    month = m;
	  },
    getYear: function(){
		  return year;
    }
	}
})();

//end calendarSettings
module.exports = calendarSettings;
