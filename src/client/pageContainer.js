const events = require('./core/events.js').events;
const calendarEvents = require('./calendarEvents.js').calendarEvents;

const eventsUI = require('./ui/calendarUI.js').eventsUI;
const calendarUI = require('./ui/calendarUI.js').calendarUI;
const calendarSideBarUI = require('./ui/calendarUI.js').calendarSideBarUI;

const p = (function() {
    return {
        tag: (t, content, id) => `<${t}> ${content} </${t}>`,
        makeDiv: (divBody, divId, divClass) => `<div class='${divClass}' id='${divId}'>${divBody}</div>`,
        makeSpan: (spanBody, spanId, spanClass) => `<span class='${spanClass}' id = '${spanId}'>${spanBody}</span>`,
        uiHandle: (uiID) => AJS.$("#" + uiID),
        toDate: (dayStamp) => {
            let [year, month, day] = dayStamp.split("-");
            return new Date(year, month - 1, day);
        }
    }
})()

const eventDecoder = (function() {
    let eventDescriptionMatcher = /Event from (\d{4}\-\d{2}\-\d{2}) to (\d{4}\-\d{2}\-\d{2})\:\s(.+)/,
        parse = (evStr) => {
            let recognized = evStr.match(eventDescriptionMatcher);
            if (recognized) {
                let [, beginDate, endDate, description] = recognized;
                return {
                    beginDate,
                    endDate,
                    description
                }
            }
        },

        makeEventObject = (evFieldValues) => {
            let beginDate = p.toDate(evFieldValues.beginDate),
                endDate = p.toDate(evFieldValues.endDate),
                description = evFieldValues.description.split(':').filter(x => x.length > 1);

            try {
                return new calendarEvents.CalendarEvent(
                    beginDate,
                    endDate,
                    description[0],
                    description[1]);
            } catch (e) {
                throw e + " at eventDecoder.makeEventObject";
            }
        }

    return {
        /********************************************************************
         * given a string describing a calendar event, verify it for format
         *  and content, and if an event can be made of it, create it, id it,
         *  and  register it with eventUtils manager
         ********************************************************************/
        processEventDescription: (calendar, eventDescriptionString) => {
            let eventDescriptionFields = parse(eventDescriptionString);
            if (eventDescriptionFields) {
                newEvent = makeEventObject(eventDescriptionFields);
                calendar.register(newEvent);
            }
        }
    }
})()

const pageContainer = (function() {

    let calendar = new events.Registrar();


    return {
        Command: function(execute, undo, value) {
            this.execute = execute;
            this.undo = undo;
            this.value = value;
        },
         
        onReady: (eventStrings) => {
            //get all events on the page into the event registrar (calendar)
            eventStrings.forEach(str => eventDecoder.processEventDescription(calendar, str));
            eventsUI.onReady(calendar);
            calendarSideBarUI.onReady(calendar);
            calendarUI.onReady(calendar);
        }
    }
})()

module.exports = {
    pageContainer
}
