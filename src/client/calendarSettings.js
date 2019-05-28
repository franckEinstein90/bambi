/**************************************************************
 *  calendarSettings module 
 *  abstracts the data element of the calendar 
 **************************************************************/

const dateUtils = require('./dateUtils.js').dateUtils;

const calendarSettings = (function() {
    let _month, _year;

    return {
	year: () => _year, 
        month: () => _month, 
        firstDay: () => dateUtils.firstDayOfMonth(_year, _month), 
        monthLength: () => dateUtils.monthLength(_year, _month), 
	beginYear : 2010, 
	endYear: 2030, 
        
       	nextMonth: function() { //set calendarSettings to following month
            let m, y;
            if (_month < 11) {
                m = _month + 1;
                y = _year;
            } else {
                m = 0;
                y = _year + 1;
            }
            calendarSettings.set(y, m);
        },
        previousMonth: function() { //set calendarSettings to previous month
            let m, y;
            if (_month > 0) {
                m = _month - 1;
                y = _year;
            } else {
                m = 11;
                y = _year - 1;
            }
            calendarSettings.set(y, m);
        },
	yearIdx: function(){
		return _year - calendarSettings.beginYear;
	}, 
        set: function(year, month) {
            if (arguments.length == 0) {
                let today = new Date();
                calendarSettings.set(today.getFullYear(), today.getMonth());
                return;
            }
            _month = month;
            _year = year;       
        }
    };
})();

//end calendarSettings
module.exports = {calendarSettings};
