/******************************************************************************
 * The dateUtils module defines several utilites related to time 
 * It includes:
 *
 ******************************************************************************/

const timeSpan = require('./timeSpan').timeSpan;

const dateUtils = (function() {

    let theMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },

        separator = "_", //used as separator for time stamps

        pad0 = (digit) => digit.toString().padStart(2, '0'); //pads with 0 up to 2 chars

    return {

        setSeparator: (sep) => separator = sep,

        firstDayOfMonth: (theYear, monthIdx) =>
            new timeSpan.Day(new Date(theYear, monthIdx, 1)),

        monthLength: (year, monthIdx, timeMeasure) =>
            Math.ceil(
                timeSpan.msSpanLength.month(year, monthIdx) /
                timeSpan.msSpanLength.day),

        monthIdxToStr: (monthIdx) => theMonths[monthIdx],

        dayStamp: function() {
            if (arguments.length == 0) { //if the function is called without arguments, returns today as dateStamp
                let d = new Date();
                return dateUtils.dayStamp(d.getFullYear(), d.getMonth(), d.getDate());
            }
            return arguments[0].toString() + separator +
                (arguments[1] + 1).toString().padStart(2, '0') + separator +
                (arguments[2]).toString().padStart(2, '0');
        },

        dayStampToDate: (dayStamp) => {
            let dateParts = dayStamp.split(separator);
            try {
                return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            }
            catch(e){
                throw e + "Unable to build date from dayStamp at dateUtils.dayStampToDate";
            }
        },

        dateToDayStamp: (someDate) => {
            return dateUtils.dayStamp(someDate.getFullYear(), someDate.getMonth(), someDate.getDate());
        }
    }
})();

module.exports = {
    dateUtils
};
