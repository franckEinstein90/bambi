//var dateUtils = require('./dateUtils.js').dateUtils;



var calendarSettings = (function() {
    let today = new Date(),
        month = today.getMonth(),
        year = today.getFullYear();

    return {
        setMonth: function(y, m) {
            year = y;
            month = m;
        },
        getYear: function() {
            return year;
        },
        firstDay: function() {
            dateUtils.firstDayOfMonth(year, month);
        },
        setValues: function(year, month) {
            this.month = month;
            this.year = year;
            this.firstDayOfMonth = dateUtils.firstDayOfMonth(this.year, this.month);
            this.monthLength = dateUtils.monthLength(this.year, this.month);
        }
    };
})();

//end calendarSettings
//module.exports = calendarSettings;//****************************//
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

//module.exports = {Events};/*var dateUtils = require('./dateUtils.js').dateUtils;
var Events = require('./events.js').Events;*/

var eventUtils = (function() {
    //****************************//
    // begin eventUtils namespace //
    //****************************//

    var events = [];

    function consoleLogEvent(ev) {
        console.log(
            dateUtils.dateToDayStamp(ev.beginDate) + " " +
            dateUtils.dateToDayStamp(ev.endDate) + " " + ev.eventTitle);
    };

    function isValidDate(date) {
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
            events.length = 0;
        },
        length: function() {
            return events.length;
        },
        eventsToStringArray: function() {
            //outputs an array of events in string format
            return events.map(ev => eventUtils.eventToString(ev));
        },
        processDateRange: function(begDateStamp, endDateStamp, strShortTitle, description) {
            //To Do: Data Validation here
            let event = eventUtils.newEvent(
                dateUtils.dayStampToDate(begDateStamp),
                dateUtils.dayStampToDate(endDateStamp),
                strShortTitle, description);
            events.push(event);
            events.sort(function(a, b) {
                if (a.beginDate < b.beginDate) {
                    return -1;
                }
                if (a.beginDate > b.beginDate) {
                    return 1;
                }
                return 0;
            });
            return event.id;
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
            var filteredEvents = events.filter(ev => (ev.beginDate <= stampDate) && (ev.endDate >= stampDate));
            if (filteredEvents.length >= 1) {
                return true;
            }
            return false;
        },
        eventsAt: function(dateStamp) {
            var stampDate = dateUtils.dayStampToDate(dateStamp);
            var filteredEvents = events.filter(ev => (ev.beginDate <= stampDate) && (ev.endDate >= stampDate));
            return filteredEvents;
        },
        consoleLogEvents: function() {
            events.forEach(consoleLogEvent);
        },
        eventIDs: function() {}
    }
    //****************************//
    // end eventUtils namespace //
    //****************************//
})();
/*module.exports = {
    eventUtils
};*/