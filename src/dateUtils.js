/******************************************************************************
 * The dateUtils module includes:
 *
 *
 ******************************************************************************/

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

        firstDayOfMonth: function(year, monthIdx) {
          return new timeSpanUtils.Day(new Date(year, monthIdx, 1));
        },

        monthLength: (year, monthIdx) => //returns the number of days in a month
            Math.ceil(
		timeSpanUtils.msSpanLength.month(year, monthIdx) / 
		timeSpanUtils.msSpanLength.day), 

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
