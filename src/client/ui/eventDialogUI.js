/******************************************************************************
 * eventDialogUI.js 
 * --------------------------
 * controls the form used to create or edit events 
 * ***************************************************************************/

/****************************************************
 * Module eventDialogUI
 ****************************************************/
const dateUtils = require('../dateUtils/dateUtils.js').dateUtils;
const calendarEvents = require('../calendarEvents.js').calendarEvents;

const ui = require('./ui.js').ui;


const eventDialogUI = (function() {

    let uiEventDialog,
        dialogAction,
        calendar,
        eventBeginDateField,
        eventEndDateField,
        dateStampToDate,
        calendarBlankEvent,
        setEventFormValues,
        setEventDialogHeader,
        registerNewEventFromFormValues,
        editEventFromFormValues,
        doError,
        validateFormFields,
        eventAsString,
        saveEventsToPage;

    uiEventDialog = ui.newUI({
        submitFormValues: "dialog-submit-button",
        dialogCancel: "dialog-cancel-button"
    });

    eventBeginDateField = "#event-dialog-begin-date";

    eventEndDateField = "#event-dialog-end-date";

    dateStampToDate = function(dayStamp) {
        let returnDate;
        dateUtils.pushSeparator("-");
        returnDate = dateUtils.dayStampToDate(dayStamp);
        dateUtils.popSeparator();
        return returnDate;
    };

    calendarBlankEvent = function(dayStamp) {
        let beginDate = dateStampToDate(dayStamp);
        return new calendarEvents.CalendarEvent(beginDate, beginDate, "", "");
    };

    setEventFormValues = function(ev) {
        //sets the value of the form to the event passed on as argument
        AJS.$(eventBeginDateField).val(ev.timeSpan.beginDate.format('YYYY-MM-DD'));
        AJS.$(eventEndDateField).val(ev.timeSpan.endDate.format('YYYY-MM-DD'));
        AJS.$("#event-dialog-title").val(ev.eventTitle);
        AJS.$("#event-dialog-description").val(ev.eventDescription);
    };

    setEventDialogHeader = function(headerTitle) {
        AJS.$("#event-dialog-action").text(headerTitle);
    };

    registerNewEventFromFormValues = function(e) {
        /********************************************************
         * collects the values entered in the form, validates them, 
         * and if valide, registers new event in calendar 
         * *****************************************************/
        e.preventDefault();
        let newCalendarEvent = validateFormFields();
        if (newCalendarEvent !== undefined) {
            calendar.register(newCalendarEvent);
            saveEventsToPage();
        }
    };

    editEventFromFormValues = function(e) {
        e.preventDefault();
        let newCalendarEvent = validateFormFields();
        if (newCalendarEvent !== undefined) {
            let registeredEvent = calendar.get(dialogAction.id);
            registeredEvent.timeSpan = newCalendarEvent.timeSpan;
            registeredEvent.eventTitle = newCalendarEvent.eventTitle;
            registeredEvent.eventDescription = newCalendarEvent.eventDescription;
            saveEventsToPage();
        }
    };

    doError = function({
        title,
        body
    }) {
        AJS.flag({
            type: 'error',
            title: title,
            body: body
        });
    };

    validateFormFields = function() {
        /****************
         * 	returns a new calendar event if dialog data is valid
         * 	**************************/
        let eventTitle, eventDescription, eventBeginDate, eventEndDate;

        try {
            eventTitle = AJS.$("#event-dialog-title").val();
            eventDescription = AJS.$("#event-dialog-description").val();
            eventBeginDate = moment(AJS.$("#event-dialog-begin-date").val());
            eventEndDate = moment(AJS.$("#event-dialog-end-date").val());

            if (eventTitle.length < 1) {
                doError({
                    title: 'Invalid event title',
                    body: 'Please provide a valid event title'
                });
                return;
            }
            if (eventEndDate.isBefore(eventBeginDate)) {
                doError({
                    title: 'Invalid date range',
                    body: "The end date for this event can't be after the beginning date"
                });
                return;
            }
            if (bambi.isDev()) {
                console.log(`creating new event title:=${eventTitle}, beginDate:=${eventBeginDate}, endDate:=${eventEndDate}, description:=${eventDescription}`);
            }
            return new calendarEvents.CalendarEvent(eventBeginDate, eventEndDate, eventTitle, eventDescription);
        } finally {

        }
    };

    eventAsString = function({
        timeSpan,
        eventTitle,
        eventDescription
    }) {
        let eventAsStr = [
                "Event from " + timeSpan.beginDate.format("YYYY-MM-DD") + " to " + timeSpan.endDate.format("YYYY-MM-DD"),
                eventTitle,
                eventDescription
            ];
        return "<li>" + eventAsStr.join(bambi.htmlEventSeparator) + "</li>";
    };

    saveEventsToPage = function() {
        let eventsAsHTMLList,
            jsonData,
            newBody;

        eventsAsHTMLList = [];
        calendar.forEach(ev => eventsAsHTMLList.push(eventAsString(ev)));
        eventsAsHTMLList.push('<li>init</li>');

        if (bambi.isDev()) {
            console.log("saving list of events");
            console.log(eventsAsHTMLList);
            return;
        }

        newBody = confluencePage.content().replace(
            /<h1>Events<\/h1><ul>(.*)<li>init<\/li><\/ul>/i,
            "<h1>Events</h1><ul>" + eventsAsHTMLList.join("") + "</ul>");

        jsonData = {
            "version": {
                "number": confluencePage.version() + 1
            },
            "title": confluencePage.title(),
            "type": "page",
            "body": {
                "storage": {
                    "value": newBody,
                    "representation": "storage"
                }
            }
        };

        AJS.flag({
            type: 'info',
            title: 'Saving new event',
            body: "please wait while your changes are being saved."
        });

        jQuery.ajax({
            type: "PUT",
            contentType: "application/json; charset=UTF-8",
            url: confluencePage.path(),
            data: JSON.stringify(jsonData),
            success: function(response) {
                console.log('Page saved!');
                location.reload();
            },
            error: function(xhr, errorText) {
                console.log('error ' + xhr.responseText);
                location.reload();
            },
            dataType: "json"
        });
    };


    return {
        onReady: function(cal) {
            calendar = cal
            ui.assignAction({
                triggerHandle: uiEventDialog.dialogCancel,
                action: () => AJS.dialog2("#event-dialog").hide()
            });
        },

        dialogActions: {
            create: 1,
            edit: function(evID) {
                return {
                    id: evID
                }
            }
        },

        getDialogAction: function() {
            return dialogAction;
        },

        deleteEvent: function(evID) {
            calendar.remove(evID);
            saveEventsToPage();
        },

        showEdit: function(evID) {
            let ev = calendar.get(evID);
            dialogAction = eventDialogUI.dialogActions.edit(evID);
            setEventDialogHeader("Modifying existing event");
            setEventFormValues(ev);
            ui.assignAction({
                triggerHandle: uiEventDialog.submitFormValues,
                action: editEventFromFormValues
            });
            AJS.dialog2("#event-dialog").show();
        },

        showNew: function(dayStamp) {
            dialogAction = eventDialogUI.dialogActions.create;
            setEventDialogHeader("Creating new event");
            if (dayStamp === undefined) {
                dateUtils.pushSeparator("-");
                dayStamp = dateUtils.dayStamp();
                dateUtils.popSeparator();
            }
            let ev = calendarBlankEvent(dayStamp);
            setEventFormValues(ev);
            ui.assignAction({
                triggerHandle: uiEventDialog.submitFormValues,
                action: registerNewEventFromFormValues
            });

            AJS.dialog2("#event-dialog").show();
        },

        publish: function(ev) {
            console.log("publishing event to page" + ev.eventTitle);
            validateFormInfo();
        }
    }
})();


module.exports = {
    eventDialogUI
};