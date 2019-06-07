/******************************************************************************
 * eventDialogController.js 
 * FranckEinstein90
 * --------------------------
 * controls the form used to create or edit events 
 * ***************************************************************************/

/****************************************************
 * Module eventDialogController
 ****************************************************/
const eventDialogController = (function() {
    let dialogAction = undefined,
        eventBeginDateField = "#event-dialog-begin-date",
        eventEndDateField = "#event-dialog-end-date",
        dateStampToDate = function(dayStamp) {
            dateUtils.setSeparator("-");
            return dateUtils.dayStampToDate(dayStamp)
        },
        calendarBlankEvent = function(dayStamp) {
            let beginDate = dateStampToDate(dayStamp);
            return new eventUtils.Event(beginDate, beginDate, "", "");
        },
        setEventFormValues = function(ev) {
            dateUtils.setSeparator('-');
            AJS.$(eventBeginDateField).val(dateUtils.dateToDayStamp(ev.beginDate));
            AJS.$(eventEndDateField).val(dateUtils.dateToDayStamp(ev.endDate));
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
        validateFormInfo = function() {
            let fieldAsDate = function(fieldID) {
                    return dateUtils.dayStampToDate(AJS.$(fieldID).val());
                },
                beginDate = fieldAsDate(eventBeginDateField),
                endDate = fieldAsDate(eventEndDateField);
            console.log("validating");
        }
    return {

        dialogActions: {
            create: 1,
            edit: 2
        },

        getDialogAction: function() {
            return dialogAction;
        },

        showEdit: function(evID) {
            dialogAction = eventDialogController.dialogActions.edit;
            setEventDialogHeader("Modifying existing event");
            let ev = eventUtils.get(evID);
            setEventFormValues(ev);
            AJS.dialog2("#event-dialog").show();
        },

        showNew: function(dayStamp) {
            dialogAction = eventDialogController.dialogActions.create;
            setEventDialogHeader("Creating new event");
            let ev = calendarBlankEvent(dayStamp);
            setEventFormValues(ev);
            AJS.dialog2("#event-dialog").show();
        },

        publish: function(ev) {
            console.log("publishing event to page" + ev.eventTitle);
            validateFormInfo();
        }
    }
})();