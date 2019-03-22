var dateUtils = require('./dateUtils.js');

var eventUtils = (function (){
	var events = [];
	function consoleLogEvent(ev){
		console.log(
			dateUtils.dateToDayStamp(ev.beginDate) + " "
			+ dateUtils.dateToDayStamp(ev.endDate) + " " + ev.eventTitle);
	};
	function isValidDate(date) {
  		return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
	};
	return{
		newEvent : function (begDate, endDate, eventShortTitle){
					if(isValidDate(begDate) && isValidDate(endDate) && typeof(eventShortTitle)==='string')
						return {
							beginDate: begDate,
							endDate: endDate,
							eventTitle: eventShortTitle
						};
	        },
		eventToString : function(ev){
				dateUtils.dateToDayStamp(ev.beginDate) + " "
				+ dateUtils.dateToDayStamp(ev.endDate) + " " + ev.eventTitle;
		},
		processDateRange : function (begDateStamp, endDateStamp, strShortTitle){
		      //To Do: Data Validation here
		      let event = eventUtils.newEvent(
			      dateUtils.dayStampToDate(begDateStamp),
			      dateUtils.dayStampToDate(endDateStamp),
			      strShortTitle);
		      events.push(event);
		      events.sort(function(a,b) {
			      if (a.beginDate < b.beginDate) {return -1;}
			      if (a.beginDate > b.beginDate) {return 1;}
		      return 0; });
		},
		processEventStrArray : function (eventStrArray, format){
			//evenStrArray is an an array of string containing event information
			//format is a regular expression that defines the format of the string
			let getValues = function(str){
					let values = format(str);
					eventUtils.processDateRange(values[0], values[1], values[2]);
				};
			eventStrArray.forEach(str => getValues(str));
		},
		consoleLogEvents : function(){
		      events.forEach(consoleLogEvent);
		}
	}
})();//end eventUtils

module.exports = {eventUtils};
