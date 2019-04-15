//var dateUtils = require('./dateUtils.js').dateUtils;



var calendarSettings = (function() {
    let today = new Date(),
        month = today.getMonth(),
        year = today.getFullYear();

    return {
	    beginYear : function(){
		    return 2010;
	    },
	    endYear: function(){
		    return 2030;
	    },
        setMonth: function(y, m) {
            year = y;
            month = m;
        },
        nextMonth: function() {
            let m, y;
            if (this.month < 11) {
                m = this.month + 1;
                y = this.year;
            } else {
                m = 0;
                y = this.year + 1;
            }
            calendarSettings.setValues(y, m);
        },
        previousMonth: function() {
            let m, y;
            if (this.month > 0) {
                m = this.month - 1;
                y = this.year;
            } else {
                m = 11;
                y = this.year - 1;
            }
            calendarSettings.setValues(y, m);
        },
	yearIdx: function(){
		return this.year - calendarSettings.beginYear();
	},
        getYear: function() {
            return year;
        },
        firstDay: function() {
            dateUtils.firstDayOfMonth(year, month);
        },
        setValues: function(year, month) {
            if (arguments.length == 0) {
                let today = new Date();
                calendarSettings.setValues(today.getFullYear(), today.getMonth());
                return;
            }
            this.month = month;
            this.year = year;
            this.firstDayOfMonth = dateUtils.firstDayOfMonth(this.year, this.month);
            this.monthLength = dateUtils.monthLength(this.year, this.month);
        }
    };
})();

//end calendarSettings
//module.exports = calendarSettings;
