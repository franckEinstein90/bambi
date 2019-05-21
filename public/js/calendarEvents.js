
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

const calendarEvents = (function() {

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
            let assignIfDefined = x => x !== undefined? x.trim():"";

            try {
                  this.timeSpan = new timeSpanUtils.TimeSpan(
                                     beginDate, endDate, 
                                     timeSpanUtils.units.days);
                  this.title = assignIfDefined(title);
                  this.eventDescription = assignIfDefined(description);

                events.Event.call(
                    this, 
                    events.eventState[this.timeSpan.includes(new Date())?"on":"off"]);
            } 
            catch (e) {
                throw (e);
            }
        },

       /*********************************************************************/
        /* Errors, exceptions, and logs
        /*********************************************************************/
        Exception: function(err) {
            this.message = err;
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


