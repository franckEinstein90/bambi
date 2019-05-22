/**************************************************************
 *  calendarSettings module 
 *  abstracts the data element of the calendar 
 **************************************************************/
const dateUtils = require('./dateUtils.js').dateUtils;

const calendarSettings = (function() {

    let _year, _month; 

    return {
	year: () => _year, 
	month: () => _month, 

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

        firstDay: () => {
            return dateUtils.firstDayOfMonth(_year, _month);
        },
	monthLength: ()=> { //returns the number of days in the month
	    return dateUtils.monthLength(_year, _month);
	}

        init: function(year, month) {
            //when no arguments is provided, sets the calendar controls
            //to today's date, and begin year to 5 years ago,
            //ed year, to 5 years from now
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
