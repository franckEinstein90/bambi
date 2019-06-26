/******************************************************************************
 * eventDialogUI.js 
 * --------------------------
 * controls the form used to create or edit events 
 * ***************************************************************************/

/****************************************************
 * Module eventDialogUI
 ****************************************************/
const bambi = require('./bambi').bambi;

const dateUtils = require('./dateUtils/dateUtils.js').dateUtils;
const moment = require('moment');

const calendarEvents = require('./calendarEvents.js').calendarEvents;

const ui = require('./ui.js').ui;
const confluencePage = require('./confluencePage.js').confluencePage;

const eventDialogUI = (function() {

    let uiEventDialog = ui.newUI({
        submitFormValues: "dialog-submit-button"
    });

    dialogAction = undefined,
        eventBeginDateField = "#event-dialog-begin-date",
        eventEndDateField = "#event-dialog-end-date",
        dateStampToDate = function(dayStamp) {
            dateUtils.setSeparator("-");
            return dateUtils.dayStampToDate(dayStamp)
        },
        calendarBlankEvent = function(dayStamp) {
            let beginDate = dateStampToDate(dayStamp);
            return new calendarEvents.CalendarEvent(beginDate, beginDate, "", "");
        },
        setEventFormValues = function(ev) {
            dateUtils.setSeparator('-');
            AJS.$(eventBeginDateField).val(dateUtils.dateToDayStamp(ev.timeSpan.beginDate));
            AJS.$(eventEndDateField).val(dateUtils.dateToDayStamp(ev.timeSpan.endDate));
            if (ev.eventTitle) {
                AJS.$("#event-dialog-title").val(ev.eventTitle);
            }
            if (ev.eventDescription) {
                AJS.$("#event-dialog-description").val(ev.eventDescription);
            }
        },
        setEventDialogHeader = function(headerTitle) {
            AJS.$("#event-dialog-action").text(headerTitle);
        },
        createNewEventFromFormValues = function(e) {
            e.preventDefault();
            let newCalendarEvent = validateFormFields();
            if (newCalendarEvent !== undefined) {
                createNewEvent(newCalendarEvent);
            }
        },
        doError = function({
            title,
            body
        }) {
            AJS.flag({
                type: 'error',
                title: title,
                body: body
            });
        },
        validateFormFields = function() {
            let fieldAsDate = function(fieldID) {
                    return dateUtils.dayStampToDate(AJS.$(fieldID).val());
                },
                eventTitle = AJS.$("#event-dialog-title").val(),
                eventDescription = AJS.$("#event-dialog-description").val(),
                beginDate = fieldAsDate(eventBeginDateField),
                endDate = fieldAsDate(eventEndDateField);
            if (eventTitle.length < 1) {
                doError({
                    title: 'Invalid event title',
                    body: 'Please provide a valid event title'
                });
                return;
            }
            if (moment(endDate).isBefore(beginDate)) {
                doError({
                    title: 'Invalid date range',
                    body: "The end date for this event can't be after the beginning date"
                });
                return;
            }
            if (bambi.isDev()) {
                //console.log(`creating new event title:=${eventTitle}, beginDate:=${beginDate}, endDate:=${endDate}, description:=${eventDescription}`);
            }
            return new calendarEvents.CalendarEvent(beginDate, endDate, eventTitle, eventDescription);
        },
        eventAsString = function({
            timeSpan,
            eventTitle,
            eventDescription
        }) {
            let dateToText = (date) => dateUtils.dateToDayStamp(date),
                eventAsStr = ["Event from " + dateToText(timeSpan.beginDate) + " to " + dateToText(timeSpan.endDate),
                    eventTitle,
                    eventDescription
                ];
            return "<li>" + eventAsStr.join(" : ") + "</li>";
        },
        createNewEvent = function(newCalendarEvent) {
            let eventListItem = eventAsString(newCalendarEvent);

            if (bambi.isDev()) {
                console.log(eventListItem);
                return;
            }
            let newBody = confluencePage.content().replace(
                "<h1>Events</h1><ul>",
                "<h1>Events</h1><ul>" + eventListItem);
            jsondata = {
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
                body: "please wait while we're saving your event"
            });
            jQuery.ajax({
                type: "PUT",
                contentType: "application/json; charset=UTF-8",
                url: confluencePage.path(),
                data: JSON.stringify(jsondata),
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

        dialogActions: {
            create: 1,
            edit: 2
        },

        getDialogAction: function() {
            return dialogAction;
        },

        showEdit: function(evID) {
            dialogAction = eventDialogUI.dialogActions.edit;
            setEventDialogHeader("Modifying existing event");
            let ev = calendarEvents.get(evID);
            setEventFormValues(ev);
            AJS.dialog2("#event-dialog").show();
        },

        showNew: function(dayStamp) {
            dialogAction = eventDialogUI.dialogActions.create;
            setEventDialogHeader("Creating new event");
            if (dayStamp === undefined) {
                dateUtils.setSeparator("-");
                dayStamp = dateUtils.dayStamp();
            }
            let ev = calendarBlankEvent(dayStamp);
            setEventFormValues(ev);
            ui.assignAction({
                triggerHandle: uiEventDialog.submitFormValues,
                action: createNewEventFromFormValues
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