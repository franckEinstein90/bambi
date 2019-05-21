/******************************************************************************
 * The timeSpanUtils module defines several utilites related to time ranges. 
 * It includes:
 *
 *  - A TimeSpan object that abstracts the concept of a length of a span 
 *    between two time markers. 
 *
 *  - A Timer object
 *
 ******************************************************************************/

const timeSpanUtils = (function() {
    const secondSpanMs = 1000,
        daySpanMs = secondSpanMs * 60 * 60 * 24,
        monthAfter = function(monthAsDate) {
            return new Date(monthAsDate.getFullYear(),
                monthAsDate.getMonth() + 1, 1);
        };

    return {
        isValidDate: function(date) {
            return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
        },
        /**************************************************
         * Includes definition for the following objects: 
         * - TimeSpan
         * - Timer
         *************************************************/
        TimeSpan: function(beginDate, endDate, timeStep) {
            if (!timeSpanUtils.isValidDate(beginDate)) {
                timeSpanUtils.invalidDate(beginDate)
            }
            if (!timeSpanUtils.isValidDate(endDate)) {
                timeSpanUtils.invalidDate(endDate)
            }
            if (endDate <= beginDate) {
                throw TimeSpan.invalidDateSpan
            }
            this.beginDate = beginDate;
            this.endDate = endDate;
            this.step = timeStep;

            return this; 
        },

        Timer: function(settings) {
            this.settings = settings;
            this.timer = null;
            this.fps = settings.fps || 30;
            this.interval = Math.floor(1000 / this.fps);
            this.timeInit = null;

            return this;
        },

        day: function() {
            return daySpanMs;
        },

        month: function(monthAsDate) {
            let thisMonth = new Date(monthAsDate.getFullYear(), monthAsDate.getMonth(), 1);
            return monthAfter(thisMonth).getTime() - thisMonth.getTime();
        },

        /*****************************************************
         * Errors and exceptions
         ****************************************************/
        invalidDate: function(aDate) {
            throw `${aDate} is not a valid date`
        },
        invalidDateSpan: "Invalid Date Span"
    };
})();

timeSpanUtils.TimeSpan.prototype = {

    setStep: function(step) {
        this.step = step;
    },

    includes: function(targetDate) {
        //returns true if the the timespan instance includes the targetDate
        let targetYear = targetDate.getFullYear();
        if (this.beginDate.getFullYear() <= targetYear && this.endDate.getFullYear() >= targetYear) {
            if (this.step === "year") {
                return true;
            }
            let targetMonth = targetDate.getMonth();
            if (this.beginDate.getMonth() <= targetMonth && this.endDate.getMonth() >= targetMonth) {
                if (this.step === "month") {
                    return true;
                }
                let targetDay = targetDate.getDate();
                if (this.beginDate.getDate() <= targetDay && this.endDate.getDate() >= targetDay) {
                    if (this.step === "day") {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}

timeSpanUtils.Timer.prototype = 
{
    run: function()
    {
        let $this = this; 
        this.settings.run();
        this.timeInit += this.interval; 
        this.timer = setTimeout(
            function(){$this.run()}, 
            this.timeInit - (new Date).getTime()
        ); 
    }, 
    start: function()
    {
        if(this.timer == null){
            this.timeInit = (new Date).getTime();
            this.run();
        }
    }, 
    stop: function()
    {
        clearTimeout(this.timer); 
        this.timer = null;
    }
} 





/******************************************************************************
* dateUtils namespace 
*******************************************************************************/
const dateUtils = (function() {
    let theMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },
        separator = "_",
        pad0 = function(digit) {
            return digit.toString().padStart(2, '0');
        };

    return {
        setSeparator: function(sep) {
            separator = sep;
        },
        firstDayOfMonth: function(theYear, monthIdx) {
            return new Date(theYear, monthIdx, 1).getDay();
        },
        monthLength: function(theYear, theMonth, timeMeasure) {
            let thisMonth = new Date(theYear, theMonth, 1);
            return Math.ceil(timeSpanUtils.month(thisMonth) / timeSpanUtils.day());
        },
        monthIdxToStr: function(monthIdx) {
            return theMonths[monthIdx];
        },
        dayStamp: function() {
            if (arguments.length == 0) { //if the function is called without arguments, returns today as dateStamp
                let d = new Date();
                return dateUtils.dayStamp(d.getFullYear(), d.getMonth(), d.getDate());
            }
            return arguments[0].toString() + separator +
                (arguments[1] + 1).toString().padStart(2, '0') + separator +
                (arguments[2]).toString().padStart(2, '0');
        },
        dayStampToDate: function(dayStamp) {
            let dateParts = dayStamp.split(separator);
            return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        },
        dateToDayStamp: function(someDate) {
            return dateUtils.dayStamp(someDate.getFullYear(), someDate.getMonth(), someDate.getDate());
        }
    }
})(); 

module.exports = {
    timeSpanUtils, 
    dateUtils
};



