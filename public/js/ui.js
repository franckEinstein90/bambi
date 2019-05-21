/******************************************************************************
 * ui.js
 * FranckEinstein90
 * ----------------
 *  includes modules 
 *  - pageContainer: all to do with the page that renders the ui
 *  - eventDialogController: controls the event create and edit dialogs
 *  - eventsUI: all to do with the events view
 *  - calendarUI: all to do with the calendar event
 *
 * ***************************************************************************/


/******************************************************************************
 * Utility functions used by all other modules on this 
 * page
 ********************************************************************/
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
})();



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
            let beginDate = p.toDate(evFieldValues.beginDate);
            endDate = p.toDate(evFieldValues.endDate);
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
        onReady: (eventStrings) => {
            try {
                //process and register all events described on the page 
                eventStrings.forEach(x => eventDecoder.processEventDescription(calendar, x));
                //render the various ui elements
                eventsUI.onReady(calendar);
                calendarUI.onReady(calendar);
            } catch (e) {
                console.log(e);
            }
        }
    };
})()


/****************************************************
 * Module eventDialogController
 * deals with forms to edit or create events
 ***************************************************/
const eventDialogController = (function() {

    let ui = {
            eventDialog: "event-dialog",
            beginDateField: "event-dialog-begin-date",
            endDateField: "event-dialog-end-date",
            titleField: "event-dialog-title",
            descriptionField: "event-dialog-description"
        },

        showDialog = () => AJS.dialog2("#" + uiElementsIds.eventDialog).show(),

        newUnregisteredEvent = (dayStamp) => {
            let evDate = toDate(dayStamp);
            return new calendarUtils.Event(evDate, evDate, "", "");
        }


    return {

        dialogActions: {
            create: 1,
            edit: 2
        },

        showNew: (dayStamp) => { //show event form to create a new event
            let ev = newUnregisteredEvent(dayStamp);
            dialogAction = eventDialogController.dialogActions.create;
            setEventFormValues(ev);
            showDialog();
        },

        showEdit: (evID) => { //shows the event form to edit exisiting event
            let ev = calendarUtils.registered.get(evID);
            dialogAction = eventDialogController.dialogActions.edit;
            setEventFormValues(ev);
            showDialog();
        }
    }
})();



const eventsUI = (function() {

    let ui = {
            eventListPane: "eventList"

        },


        renderEventsFrame = () => AJS.$("#eventList"),

        renderEventPane = (calendarEvent) => `<h1>${calendarEvent.title}</h1>`,

        renderEventsView = (calendar) => {
            eventList = renderEventsFrame();
            calendar.forEach(x => eventList.append(renderEventPane(x)));
        }

    return {

        onReady: (calendar) => {
            renderEventsView(calendar);
        }
    }

})();


const calendarUI = (function() {

    let ui = {
            calendarTitle: "tableCalendar-title",
            calendarBody: "tableBody",
            previousMonth: "select-previous-month",
            nextMonth: "select-next-month"
        },

        assignAction = (cmd, action) => {
            p.uiHandle(cmd).click(function(e) {
                action();
                setFormValues();
                renderCalendar();
            })
        },

        addCalendarRow = (week) => {

        },

        clear = () => {

        },

        setTitle = () => {

        },

        renderCalendar = () => {
            clear();
            setTitle();
            calendarSettings.weekSpan.forEach(addCalendarRow);
        }

    return {
        onReady: (calendar) => {
            calendarSettings.set();
            assignAction(ui.previousMonth, x => calendarSettings.previousMonth());
            assignAction(ui.nextMonth, x => calendarSettings.nextMonth());
            renderCalendar();
        }
    }
})();
