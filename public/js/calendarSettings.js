/******************************************************************************
 *
 *
 * ***************************************************************************/


const calendarSettings = (function() {

    let timeContext = function(month, year) {
            this.month = month; 
            this.year = year; 
        };
 
    return {
       

        beginYear: 2010, 
        lastYear: 2030,

        get weekSpan(){
            return [1,2,3,4,5];
        },

setMonth: function(y, m) {
            year = y;
            month = m;
        },
        nextMonth: function() {
            let m, y;
            if (timeContext.month < 11) {
                m = timeContext.month + 1;
                y = timeContext.year;
            } else {
                m = 0;
                y = timeContext.year + 1;
            }
            calendarSettings.set(y, m);
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
            calendarSettings.set(y, m);
        },
        yearIdx: function() {
            return this.year - calendarSettings.beginYear();
        },

        getYear: function() {
            return year;
        },

        firstDay: function() {
            return dateUtils.firstDayOfMonth(year, month);
        },

        set: function(year, month) {
            if (arguments.length == 0) {
                let today = new Date();
                calendarSettings.set(today.getFullYear(), today.getMonth());
                return;
            }
            //assert year >= ???  //assert 0<=month<=11
            timeContext(year, month); 
       }
    };
})();
