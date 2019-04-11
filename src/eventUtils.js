var dateUtils = require('./dateUtils.js').dateUtils;


function Event(options) {
    this.state = options.status || "off";
    this.id = options.id || getNewID();
}

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

    function isValidDate(date) {
        return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
    };
    return {
        Event: function Event(beginDate, endDate, title, description) {
            this.beginDate = beginDate;
            this.endDate = endDate;
            this.eventTitle = title;
            this.eventDescription = description;
	    this.eventID = generateUUID();
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
            return event.eventID;
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
	eventIDs: function(){
	}
    }
    //****************************//
    // end eventUtils namespace //
    //****************************//
})();
module.exports = {
    eventUtils
};
