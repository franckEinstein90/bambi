
var calendarSettings = (function() {
    let today = new Date(),
        month = today.getMonth(),
        year = today.getFullYear();

    return {
	    beginYear : function(){
		    return 2010;
	    },
	    endYear: function(){
		    return 2030;
	    },
        setMonth: function(y, m) {
            year = y;
            month = m;
        },
        nextMonth: function() {
            let m, y;
            if (this.month < 11) {
                m = this.month + 1;
                y = this.year;
            } else {
                m = 0;
                y = this.year + 1;
            }
            calendarSettings.setValues(y, m);
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
            calendarSettings.setValues(y, m);
        },
	yearIdx: function(){
		return this.year - calendarSettings.beginYear();
	},
        getYear: function() {
            return year;
        },
        firstDay: function() {
            dateUtils.firstDayOfMonth(year, month);
        },
        setValues: function(year, month) {
            if (arguments.length == 0) {
                let today = new Date();
                calendarSettings.setValues(today.getFullYear(), today.getMonth());
                return;
            }
            this.month = month;
            this.year = year;
            this.firstDayOfMonth = dateUtils.firstDayOfMonth(this.year, this.month);
            this.monthLength = dateUtils.monthLength(this.year, this.month);
        }
    };
})();
//end calendarSettings



// begin timeSpan namespace //
//****************************//
const timeSpan = (function() {
    const secondSpanMs = 1000,
        daySpanMs = secondSpanMs * 60 * 60 * 24,
        monthAfter = function(monthAsDate) {
            return new Date(monthAsDate.getFullYear(),
                monthAsDate.getMonth() + 1, 1);
        }, 
		validSpan = (beginDate, endDate)=>{
			return validDate(beginDate) && validDate(endDate);
		}
    return {
		TimeSpan: (beginDate, endDate) => {
			if(!validSpan(beginDate, endDate)){
				throw TimeSpan.invalidTimeSpan;
			}
			this.beginDate = beginDate;
			this.endDate = endDate; 
		},
        day: function() {
            return daySpanMs;
        },
        month: function(monthAsDate) {
            let thisMonth = new Date(monthAsDate.getFullYear(), monthAsDate.getMonth(), 1);
            return monthAfter(thisMonth).getTime() - thisMonth.getTime();
        }, 
		invalidTimeSpan: "Invalid Time Span"
    };
})();



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
            return Math.ceil(timeSpan.month(thisMonth) / timeSpan.day());
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

const events = (function(){
	generateUUID = () => {
    	let d = new Date().getTime();
  		if (typeof performance !== 'undefined' && 
				typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        	let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };		
	return{
		eventState:{
			on: 1, 
			off: 0
		}, 
		Event: => (state){
			this.id = generateUUID();
			if (state === undefined) {
				this.state = events.eventState.on; 
			} else {
				this.state = state
			}
		}
	}
})();

//****************************//
// begin eventUtils namespace //
//****************************//
var eventUtils = (function() {
    const calendar = new Map();
    let filter = (filterPred) => {
            //returns an array of calendar events filtered
            //as per the predicate argument
            let arrayRes = [];
            calendar.forEach((value, key) => {
                if (filterPred(value)) {
                    arrayRes.push(value)
                }
            });
            return arrayRes;
        },
        logEvent = (ev) => {
            console.log(
                dateUtils.dateToDayStamp(ev.beginDate) + " " +
                dateUtils.dateToDayStamp(ev.endDate) + " " + ev.eventTitle);
        },

        isValidDate = (date) => {
            return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
        };
    return {
        CalendarEvent: (beginDate, endDate, title, description) => {
			try {
				events.Event.call(this);
            	this.timeSpan = new timeSpanUtils(beginDate, endDate);
            	this.eventTitle = title;
            	this.eventDescription = description;
			}
			catch (err) {
				throw err; 
			}
        },
        register: (calendarEvent) => {
            calendar.set(calendarEvent.id, calendarEvent);
        },
        remove: function(eventId) {},
        get: (eventId) => {
            //returns the event with the given evID
		return calendar.get(eventId);
        },

       eventToString: function(ev) {
            let eventStr = dateUtils.dateToDayStamp(ev['beginDate']) + " " +
                dateUtils.dateToDayStamp(ev['endDate']) + " " +
                ev['eventTitle'];
            if (typeof ev.eventDescription !== 'undefined') {
                eventStr += " [" + ev.eventDescription + "]";
            }
            return eventStr;
        },
        flush: function() {
            //empties the list of events
            calendar.clear();
        },
        size: function() {
            return calendar.size;
        },

        eventsToStringArray: function() {
            //returns a copied array of the events in the event store
            let eventArray = [];
            for (var value of events.values()) {
                eventArray.push(eventUtils.eventToString(value));
            }
            return eventArray;
        },
       removeEvent: (eventId) => {
            calendar.delete(eventId);
        },
        processEventStrArray: function(eventStrArray, format) {
            //evenStrArray is an an array of string containing event information
            //format is a regular expression that defines the format of the string
            let getValues = function(str) {
                let values = format(str);
                eventUtils.processDateRange(values[0], values[1], values[2]);
            };
            eventStrArray.forEach(str => getValues(str));
        },
        eventExistsAt: function(dateStamp) {
            var stampDate = dateUtils.dayStampToDate(dateStamp);
            return filter(ev => (ev.beginDate <= stampDate) && (ev.endDate >= stampDate)).length >= 1;
        },
        eventsOn: (dateStamp) => {
            let stampDate = dateUtils.dayStampToDate(dateStamp);
            return filter(ev => (ev.beginDate <= stampDate) && (ev.endDate >= stampDate));
        },
        logEvents: () => {
            calendar.forEach(logEvent);
        }
    }
    //****************************//
    // end eventUtils namespace //
    //****************************//
})();

eventUtils.CalendarEvent.prototype = Object.create(events.Event.prototype);
eventUtils.CalendarEvent.constructor = events.Event
