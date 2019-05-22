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

        firstDay: () => dateUtils.firstDayOfMonth(_year, _month),

        //returns the number of days in the month
        monthLength: () => dateUtils.monthLength(_year, _month),

        beginYear: 2010,

        endYear: 2030,

        setMonth: function(y, m) {
            _year = y;
            _month = m;
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
        yearIdx: () => _year - calendarSettings.beginYear,
        init: function(year, month) {
            //when no arguments is provided, sets the calendar controls
            //to today's date, and begin year to 5 years ago,
            //ed year, to 5 years from now
            if (arguments.length == 0) {
                let today = new Date();
                calendarSettings.init(today.getFullYear(), today.getMonth());
                return;
            }
            _month = month;
            _year = year;
        }
    };
})();

//end calendarSettings
module.exports = calendarSettings;
