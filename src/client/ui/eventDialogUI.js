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
         createNewEventFromFormValues = function(e){
              let eventTitle = AJS.$("#event-dialog-title").val();
              e.preventDefault();
 //           validateFormFields();
              createNewEvent({eventTitle});
       },

        validateFormFields = function() {
            let fieldAsDate = function(fieldID) {
                    return dateUtils.dayStampToDate(AJS.$(fieldID).val());
                },
                beginDate = fieldAsDate(eventBeginDateField),
                endDate = fieldAsDate(eventEndDateField);
            console.log("validating");
        }, 
        createNewEvent = function({eventTitle}){
            jQuery.ajax({
                type: "POST", 
                url:  "http://localhost:3000/event/create/" + eventTitle, 
                success: x => console.log("ffdsa:w"), 
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
            if(dayStamp === undefined){
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
