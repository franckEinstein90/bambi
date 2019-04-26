/******************************************************************************
 * calendarEvents namespace 
 * FranckEinstein
 * 
 *  A library to manage calendar  events. Includes:
 *   - Implementation for calendarEvent prototype, which inherits from events
 *   - Implementation for a map registrar in which events can be registered
 *****************************************************************************/

const timeSpanUtils = require('./dateUtils.js').timeSpanUtils;
const dateUtils = require('./dateUtils.js').dateUtils;
const Events = require('./events.js').Events;

const calendarEvents = (function() {

    /******************************************************************/
    /* events is the event registrar. It's a map object.
    /* The keys are event id strings, which calendar events 
    /* get from the events.Event prototype
    /******************************************************************/
    const events = new Map();

    /******************************************************************/
    /* returns an array of calendar events filtered
    /* as per the predicate argument
    /******************************************************************/
    let filter = function(filterPred) {
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
                dateUtils.dateToDayStamp(ev.endDate) + " " + ev.eventTitle + " " + ev.eventDescription);
        },
        validDate = function(date) {
            return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
        };

    return {
        CalendarEvent: function(beginDate, endDate, title, description) {
            if(!validDate(beginDate) || !validDate(endDate)) {
                throw new calendarEvents.Exception("Invalid date parameters");
            }
            try {
                new timeSpanUtils.TimeSpan(beginDate, endDate);
                Events.Event.call(this);
                this.beginDate = beginDate;
                this.endDate = endDate;
                this.eventTitle = title;
                this.eventDescription = description;
            }
            catch(e){
                throw(e);
            }
       },
        register(calendarEvent) {
            let eventRange = new timeSpanUtils.TimeSpan(
                calendarEvent.beginDate,
                calendarEvent.endDate,
                "day");
            if (eventRange.includes(new Date())) {
                calendarEvent.on();
            } else {
                calendarEvent.off();
            }
            events.set(calendarEvent.id, calendarEvent);
        },

        /*********************************************************************/
        /* Bread and butter handlers 
        /*********************************************************************/
        flush: function() {
            //removes all events
            events.clear();
        },
        size: function() {
            return events.size;
        },
        remove: function(eventId) {
            if (!events.has(eventId)) {
                throw new calendarEvents.Exception("Event does not exist");
            }
            events.delete(eventId);
        },
        get: function(eventId) {
            //returns event with given evID
            return events.get(eventId);
        },
        forEach: function(eventProcessingCallBack) {
            events.forEach(eventProcessingCallBack);
        },
        newEvent: function(begDate, endDate, eventTitle, eventDescription) {
            if (validDate(begDate) && validDate(endDate) && typeof(eventTitle) === 'string') {
                return new calendarEvents.CalendarEvent(begDate, endDate, eventTitle, eventDescription);
            } else {
                throw new calendarEvent.Exception("unexpected argument");
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
        eventsToStringArray: function() {
            //returns a copied array of the events in the event store
            let eventArray = [];
            for (var value of events.values()) {
                eventArray.push(calendarEvents.eventToString(value));
            }
            return eventArray;
        },
        processDateRange: function(begDateStamp, endDateStamp, strShortTitle, description) {
            //To Do: Data Validation here
            let calendarEvent = calendarEvents.newEvent(
                dateUtils.dayStampToDate(begDateStamp),
                dateUtils.dayStampToDate(endDateStamp),
                strShortTitle, description);
            calendarEvents.register(calendarEvent);
            return calendarEvent.id;
        },
        processEventStrArray: function(eventStrArray, format) {
            //evenStrArray is an an array of string containing event information
            //format is a regular expression that defines the format of the string
            let getValues = function(str) {
                let values = format(str);
                calendarEvents.processDateRange(values[0], values[1], values[2]);
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
        /*********************************************************************/
        /* Errors, exceptions, and logs
        /*********************************************************************/
        Exception: function(err) {
            this.message = err;
        },
        logEvents: function() {
            events.forEach(logEvent);
        }
    }
    //****************************//
    // end calendarEvents namespace //
    //****************************//
})();

/*****************************************************************************/
/* Inheritance for calendarEvents.CalendarEvent from events.Event 
/*****************************************************************************/
calendarEvents.CalendarEvent.prototype = Object.create(Events.Event.prototype);
calendarEvents.CalendarEvent.constructor = Events.Event;

module.exports = {
    calendarEvents
};
