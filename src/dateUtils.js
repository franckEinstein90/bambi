
/******************************************************************************
 * The timeSpanUtils module defines several utilites related to time ranges. 
 * It includes:
 *
 *  - A TimeSpan constructor that verifies that a span defined by two dates 
 *    is valid
 *
 ******************************************************************************/
const validDate = function(date) {
        return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

const timeSpanUtils = (function() {
    const secondSpanMs = 1000,
        daySpanMs = secondSpanMs * 60 * 60 * 24,
        monthAfter = function(monthAsDate) {
            return new Date(monthAsDate.getFullYear(),
                monthAsDate.getMonth() + 1, 1);
        };
    return {
        TimeSpan: function(beginDate, endDate, timeStep) {
            this.beginDate = beginDate;
            this.endDate = endDate;
            this.step = timeStep;
        },
        day: function() {
            return daySpanMs;
        },
        month: function(monthAsDate) {
            let thisMonth = new Date(monthAsDate.getFullYear(), monthAsDate.getMonth(), 1);
            return monthAfter(thisMonth).getTime() - thisMonth.getTime();
        }
    };
})();

timeSpanUtils.TimeSpan.prototype.setStep = function(step) {
  this.step = step;
}

timeSpanUtils.TimeSpan.prototype.includes = function(targetDate) {
    //returns true if the the timespan instance includes the targetDate
    let targetYear = targetDate.getFullYear();
    if(this.beginDate.getFullYear() <= targetYear && this.endDate.getFullYear() >= targetYear){
        if(this.step === "year"){return true;}
        let targetMonth = targetDate.getMonth();
        if(this.beginDate.getMonth() <= targetMonth && this.endDate.getMonth() >= targetMonth){
          if(this.step === "month"){return true;}
          let targetDay = targetDate.getDate();
          if(this.beginDate.getDate() <= targetDay && this.endDate.getDate() >= targetDay){
            if(this.step === "day"){return true;}
          }
        }
    }
    return false;
}

//****************************//
// begin dateUtils namespace //
//****************************//
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
})(); //end dateUtils

module.exports = {
    timeSpanUtils,
    dateUtils
};
