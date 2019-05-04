/******************************************************************************
 * calendarEvents namespace 
 * FranckEinstein
 * ------------------------
 * 
 *  A library to manage calendar events. Defines objects: 
 *   - calendarEvents.Event
 *   - calendarEvents.EventSequence
 *
 ******************************************************************************/
const timeSpanUtils = require('./dateUtils').timeSpanUtils;
const dateUtils = require('./dateUtils').dateUtils;
const events = require('./events').events;


/******************************************************************************
 * 
 * 
 * ***************************************************************************/
const calendarEvents = (function() {

    logEvent = function(ev) {
            console.log(
                dateUtils.dateToDayStamp(ev.beginDate) + " " +
                dateUtils.dateToDayStamp(ev.endDate) + " " + ev.eventTitle + " " + ev.eventDescription);
        }

    return {
        
        /******************************************************************
         *  A calendar event is a type of event that has the following
         *  properties:
         *
         *  - A begin date (beginDate)
         *  - An end date  (endDate)
         *  - A title (at most 255 chars)
         *  - A description (at most 510 chars)
         ***********************************************************************/

        CalendarEvent: function(beginDate, endDate, title, description) {
            if (!validDate(beginDate) || !validDate(endDate)) {
                throw new calendarEvents.Exception("Invalid date parameters");
            }
            try {
                new timeSpanUtils.TimeSpan(beginDate, endDate);
                events.Event.call(this);
                this.beginDate = beginDate;
                this.endDate = endDate;
                this.eventTitle = title;
                this.eventDescription = description;
            } catch (e) {
                throw (e);
            }
        },

        /******************************************************************
         * calendar is the event registrar for calendarEvents
         ******************************************************************/
        calendar: new events.Registrar(),

        register: function(calendarEvent) { //registers a calendarEvent
            //calendar events are registered as on if the registration 
            //happens during the datespan they occupy. 
            let eventRange = new timeSpanUtils.TimeSpan(
                calendarEvent.beginDate,
                calendarEvent.endDate,
                "day");
            if (eventRange.includes(new Date())) {
                calendarEvent.on();
            } else {
                calendarEvent.off();
            }
            calendarEvents.calendar.register(calendarEvent);
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
        eventRegistrarToStringArray: function() {
            //returns a copied array of the eventRegistrar in the event store
            let eventArray = [];
            for (var value of eventRegistrar.values()) {
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
            calendarEvents.calendar.register(calendarEvent);
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
        eventRegistrarOn: function(dateStamp) {
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
            eventRegistrar.forEach(logEvent);
        }
    }
    //****************************//
    // end calendarEvents namespace //
    //****************************//
})();

/*****************************************************************************/
/* Inheritance for calendarEvents.CalendarEvent from eventRegistrar.Event 
/*****************************************************************************/
calendarEvents.CalendarEvent.prototype = Object.create(events.Event.prototype);
calendarEvents.CalendarEvent.constructor = events.Event;

module.exports = {
    calendarEvents
};
