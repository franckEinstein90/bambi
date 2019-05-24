/**************************************************************/
/*  calendarSettings module ***********************************/
/*  abstracts the data element of the calendar ****************/
/**************************************************************/
const dateUtils = require('./dateUtils.js').dateUtils;
const calendarSettings = (function() {
	let _year, _month; 
    return {
        beginYear: 2010,  
        endYear: 2030,  
        
        setMonth: function(y, m) {
            year = y;
            month = m;
        },
        nextMonth: function() {
            let m, y;
            if (_month < 11) {
                m = _month + 1;
                y = _year;
            } else {
                m = 0;
                y = _year + 1;
            }
            calendarSettings.init(y, m);
        },
        previousMonth: function() {
            let m, y;
            if (_month > 0) {
                m = _month - 1;
                y = _year;
            } else {
                m = 11;
                y = _year - 1;
            }
            calendarSettings.init(y, m);
        },
        yearIdx: function() {
            return _year - calendarSettings.beginYear;
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
