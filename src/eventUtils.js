var dateUtils = require('./dateUtils.js').dateUtils;
var Events = require('./events.js').Events;

var eventUtils = (function() {
    //****************************//
    // begin eventUtils namespace //
    //****************************//

    const events = new Map();
    let filter = function(filterPred){
        //returns an array of calendar events filtered
        //as per the predicate argument
        let arrayRes = [];
        events.forEach((value, key)=>{if(filterPred(value)){arrayRes.push(value)}});
        return arrayRes; 
    };
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
        register(calendarEvent) {
            events.set(calendarEvent.id, calendarEvent);
        },
        remove: function(eventId){
        },
        get: function(eventId) {
            //returns the event with the given evID 
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
        consoleLogEvents: function() {
            events.forEach(consoleLogEvent);
        }
    }
    //****************************//
    // end eventUtils namespace //
    //****************************//
})();
module.exports = {
    eventUtils
};
