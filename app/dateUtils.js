var dateUtils = (function (){

	let theMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	let dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

	return{
		firstDayofMonth: function(theYear,theMonth){
		  return new Date(theYear,theMonth,1).getDay();
		},
		monthLength: function(theYear, theMonth){
		  //returns the number of days in a month
		  let oneDay = 1000 * 60 * 60 * 24;
		  let thisMonth = new Date(theYear, theMonth, 1);
		  let nextMonth = new Date(theYear, theMonth + 1, 1);
		  let len = Math.ceil((nextMonth.getTime() - thisMonth.getTime())/oneDay);
		  return len;
		},
		monthIdxToStr: function(monthIdx){
		  return theMonths[monthIdx];
		},
		dayStamp: function(){
		  if(arguments.length == 0) { //if the function is called without arguments, returns today as dateStamp
			  let d = new Date();
			  return dateUtils.dayStamp(d.getFullYear(), d.getMonth(), d.getDate());
	          }
		  return arguments[0].toString() + "_"
				+ (arguments[1]+1).toString().padStart(2,'0') + "_"
				+ (arguments[2]).toString().padStart(2,'0');
		},
		dayStampToDate: function(dayStamp){
		  let dateParts = dayStamp.split("_");
		  return new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
		},
		dateToDayStamp: function(someDate){
			return dateUtils.dayStamp(someDate.getFullYear(), someDate.getMonth(), someDate.getDate());
		}
      }
    })();//end dateUtils

module.exports = dateUtils;
