
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
        };
    return {
        day: function() {
            return daySpanMs;
        },
        month: function(monthAsDate) {
            let thisMonth = new Date(monthAsDate.getFullYear(), monthAsDate.getMonth(), 1);
            return monthAfter(thisMonth).getTime() - thisMonth.getTime();
        }
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
})(); //end dateUtils

/*module.exports = {
    timeSpan,
    dateUtils
};*/var Events = (function() {
    function generateUUID() {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    return {
        Event: function() {
            this.id = generateUUID();
            this.status = "ongoing";
            this.flip = function() {
                console.log("flipping status");
            };
        }
    }
})();


//****************************//
// begin eventUtils namespace //
//****************************//
var eventUtils = (function() {
    const events = new Map();
    let filter = function(filterPred) {
            //returns an array of calendar events filtered
            //as per the predicate argument
            let arrayRes = [];
            events.forEach((value, key) => {
                if (filterPred(value)) {
                    arrayRes.push(value)
                }
            });
            return arrayRes;
        },
        logEvent = function(ev) {
            console.log(
                dateUtils.dateToDayStamp(ev.beginDate) + " " +
                dateUtils.dateToDayStamp(ev.endDate) + " " + ev.eventTitle);
        },

        isValidDate = function(date) {
            return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
        };
    return {
        Event: function Event(beginDate, endDate, title, description) {
            Events.Event.call(this);
            this.beginDate = beginDate;
            this.endDate = endDate;
            this.eventTitle = title;
            this.eventDescription = description;
        },
        register(calendarEvent) {
            events.set(calendarEvent.id, calendarEvent);
        },
        remove: function(eventId) {},
        get: function(eventId) {
            //returns the event with the given evID
		return events.get(eventId);
        },
        newEvent: function(begDate, endDate, eventTitle, eventDescription) {
            if (isValidDate(begDate) && isValidDate(endDate) && typeof(eventTitle) === 'string') {
                return new eventUtils.Event(begDate, endDate, eventTitle, eventDescription);
            } else {
                throw ("unexpected argument");
            }
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
            events.clear();
        },
        size: function() {
            return events.size;
        },
        eventsToStringArray: function() {
            //returns a copied array of the events in the event store
            let eventArray = [];
            for (var value of events.values()) {
                eventArray.push(eventUtils.eventToString(value));
            }
            return eventArray;
        },
        processDateRange: function(begDateStamp, endDateStamp, strShortTitle, description) {
            //To Do: Data Validation here
            let calendarEvent = eventUtils.newEvent(
                dateUtils.dayStampToDate(begDateStamp),
                dateUtils.dayStampToDate(endDateStamp),
                strShortTitle, description);
            eventUtils.register(calendarEvent);
            return calendarEvent.id;
        },
        removeEvent: function(eventId) {
            events.delete(eventId);
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
        eventsOn: function(dateStamp) {
            let stampDate = dateUtils.dayStampToDate(dateStamp);
            return filter(ev => (ev.beginDate <= stampDate) && (ev.endDate >= stampDate));
        },
        logEvents: function() {
            events.forEach(logEvent);
        }
    }
    //****************************//
    // end eventUtils namespace //
    //****************************//
})();
