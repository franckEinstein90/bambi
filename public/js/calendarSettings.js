/******************************************************************************
 *
 *
 * ***************************************************************************/


const calendarSettings = (function() {

    let timeContext = function(month, year) {
            this.month = month; 
            this.year = year; 
           // this.firstDayOfMonth = dateUtils.firstDayOfMonth(this.year, this.month);
            //this.monthLength = dateUtils.monthLength(this.year, this.month);
        };
 
    return {
       
        beginYear: function() {
            return 2010;
        },
        endYear: function() {
            return 2030;
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

        set: (year, month) => {
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
