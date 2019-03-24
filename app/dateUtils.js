const expect = require('chai').expect;

//****************************//
// begin timeSpan namespace //
//****************************//
 const timeSpan = (function (){
    const daySpanMs = 1000 * 60 * 60 * 24
          , monthAfter = function(monthAsDate){
                expect(monthAsDate).to.be.a('date');
                return new Date( monthAsDate.getFullYear(), 
                             monthAsDate.getMonth() + 1, 1);
          };
    return{
        day : function(){
            return daySpanMs;
        },
        month : function(monthAsDate){
   		    let thisMonth = new Date(monthAsDate.getFullYear()
                                     , monthAsDate.getMonth(), 1);
            return monthAfter(thisMonth).getTime() - thisMonth.getTime();
        }
    }
})();

//****************************//
// begin dateUtils namespace //
//****************************//
 const dateUtils = (function (){
    const theMonths = [ "January","February","March", "April"
                        , "May","June","July", "August"
                        , "September","October", "November","December"];
	const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    let delimiter = "_"
        , pad0 = function(digit){
            return digit.toString().padStart(2,'0');
          };

	return{
		firstDayofMonth: function(theYear,monthIdx){
		  return new Date(theYear,monthIdx,1).getDay();
		},
		monthLength: function(theYear, theMonth, timeMeasure){
   		  let thisMonth = new Date(theYear, theMonth, 1);
          return Math.ceil(timeSpan.month(thisMonth)/timeSpan.day());
		},
		monthIdxToStr: function(monthIdx){
		  return theMonths[monthIdx];
		},
		dayStamp: function(){
		  if(arguments.length == 0) { //if the function is called without arguments, returns today as dateStamp
			  let d = new Date();
			  return dateUtils.dayStamp(d.getFullYear(), d.getMonth(), d.getDate());
	          }
		  return [  arguments[0].toString(), 
                    pad0(arguments[1]+1), 
                    pad0(arguments[2])  ].join(delimiter);
		},
		dayStampToDate: function(dayStamp){
		  let dateParts = dayStamp.split(delimiter);
		  return new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
		},
		dateToDayStamp: function(someDate){
			return dateUtils.dayStamp(someDate.getFullYear(), someDate.getMonth(), someDate.getDate());
		}
      };
    })();//end dateUtils

module.exports = {timeSpan , dateUtils};
