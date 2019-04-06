// @flow
var dateUtils = require('./dateUtils.js').dateUtils;



class Event {
    construtor(bdate, edate, title){
            this.beginDate=bdate;
            this.endDate=edate;
            this.title=title;
        }
    get beginDate(){
        return this._beginDate;
    }
    get endDate(){
        return this._endDate;
    }
    get title(){
        return this._title;
    }

    toString(separator){ 
       return `${this.beginDate + separator}
               ${this.endDate + separator}
               ${this.title}`; 
    }
}

 
     
var eventUtils = (function (){
//****************************//
// begin eventUtils namespace //
//****************************//

	var events = [];
	function consoleLogEvent(ev){
		console.log(
			dateUtils.dateToDayStamp(ev.beginDate) + " "
			+ dateUtils.dateToDayStamp(ev.endDate) + " " + ev.title);
	};
	function isValidDate(date) {
  		return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
	};
	return{
		newEvent : function (begDate, endDate, title){
            if(isValidDate(begDate) && isValidDate(endDate)){
                    return new Event(begDate, endDate, title);
            }
            throw('Invalid Args at newEvent');
	    },
		eventToString : function(ev){
            return ev.toString();
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
	};
//****************************//
// end eventUtils namespace //
//****************************//
})();

module.exports = {eventUtils};
