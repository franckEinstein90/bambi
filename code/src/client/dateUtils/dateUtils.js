/******************************************************************************
 * The dateUtils module defines several utilites related to time 
 * It includes:
 *
 ******************************************************************************/
const bambi = require('../../bambi').bambi;
const timeSpan = require('./timeSpan').timeSpan;

const assert = require('chai').assert;

const dateUtils = (function() {

    let separator,
        pad0,
        _today;

    	separatorFIFO = ["_"]; //used as separator for time stamps
    	pad0 = (digit) => digit.toString().padStart(2, '0'); //pads with 0 up to 2 chars
    	_today = new Date();
    
return {

	today: {
		year: _today.getFullYear(), 
		month: _today.getMonth(), //Jan = 0, ..., Dec = 11
		day: _today.getDate(),
		monthIDX: _today.getDate(), 
		weekIDX: _today.getDay() //Sunday = 0, ..., Saturday = 6
	},
	
	separator: () => separatorFIFO[0], 

        pushSeparator: (sep) => separatorFIFO.unshift(sep),
	
	popSeparator: function() {
		if (separatorFIFO.length > 0) {separatorFIFO.shift();}
	},

        firstDayOfMonth: (theYear, monthIdx) =>
            new timeSpan.Day(new Date(theYear, monthIdx, 1)),

        monthLength: (year, monthIdx, timeMeasure) =>
            Math.ceil(
                timeSpan.msSpanLength.month(year, monthIdx) /
                timeSpan.msSpanLength.day),

        monthIdxToStr: function(monthIdx){
		assert(monthIdx >=0 && monthIdx <=11);
		return bambi.clientData.monthsEn[monthIdx];
	},

        dayStamp: function() { //returns a new date stamp in format "yyyy[sep]mm[sep]dd"
	  	let args = [].slice.call(arguments, 0), 
			year, 
			month, 
			day;
		if(args.length === 0) { //no arguments use today's date
			year = dateUtils.today.year;
			month = dateUtils.today.month + 1;
			day = dateUtils.today.day;
		}		else
		{
		  let dateDesc = args.shift();
			year = dateDesc.year;
			month = dateDesc.month + 1; 
			day = dateDesc.day;
		}
            	return [year, month, day].map(x => pad0(x)).join(separatorFIFO[0]);

        },

        dayStampToDate: (dayStamp) => {
            let dateParts = dayStamp.split(separatorFIFO[0]);
            try {
                return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            } catch (e) {
                throw e + "Unable to build date from dayStamp at dateUtils.dayStampToDate";
            }
        },

        dateToDayStamp: (someDate) => {
            return dateUtils.dayStamp({year:someDate.getFullYear(), month:someDate.getMonth(), day:someDate.getDate()});
        }
    };
})();

module.exports = {
    dateUtils
};
