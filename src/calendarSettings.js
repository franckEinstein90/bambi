/**************************************************************/
/*  calendarSettings module ***********************************/
/*  abstracts the data element of the calendar ****************/
/**************************************************************/
const dateUtils = require('./dateUtils.js').dateUtils;
const calendarSettings = (function() {
    let today = new Date(),
        month = today.getMonth(),
        year = today.getFullYear(), 
	firstYear = 2010, 
	lastYear  = 2030;

    return {
        beginYear: function() {
            return firstYear;
        },
        endYear: function() {
            return lastYear;
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
            calendarSettings.init(y, m);
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
            calendarSettings.init(y, m);
        },
        yearIdx: function() {
            return this.year - calendarSettings.beginYear();
        },
        getYear: function() {
            return year;
        },
        firstDay: function() {
            dateUtils.firstDayOfMonth(year, month);
        },
        init: function(year, month) {
            //when no arguments is provided, sets the calendar controls
            //to today's date, and begin year to 5 years ago,
            //end year, to 5 years from now
            if (arguments.length == 0) {
                let today = new Date();
                calendarSettings.init(today.getFullYear(), today.getMonth());
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
module.exports = calendarSettings;
