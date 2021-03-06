"use strict";
/******************************************************************************
 * eventDialogUI.js 
 * --------------------------
 * controls the form used to create or edit events 
 * Module eventDialogUI
 *******************************************************************************/
const bambi = require('../bambi').bambi;


/********************************
 * time related requires
 ********************************/
const dateUtils = require('../time/dateUtils.js').dateUtils;
const moment = require('moment');

const events = require('../events/events').events
const calendarEvents = require('../events/calendarEvents').calendarEvents
const eventCategories = require('../events/eventCategories').eventCategories

const ui = require('../ui.js').ui
const confluencePage = require('../client/confluencePage.js').confluencePage

const eventFormValidator = (function(){

    let reset, eventProperties, readFormValues, 
    validateTitle, validateDateSpan, 
    //validation
    doError, errorFlag
   
    reset = function(){
        eventProperties = {
            eventTitle:"", 
            eventDescription:"", 
            eventCategory:0,
            eventBeginDate:null, 
            eventEndDate:null
        }
        errorFlag = false
    }
    readFormValues = function(){
            eventProperties.eventCategory = (AJS.$("#important-event").is(":checked"))?1:0
            eventProperties.eventTitle = AJS.$("#event-dialog-title").val()
            eventProperties.eventDescription = AJS.$("#event-dialog-description").val()
            eventProperties.eventBeginDate = moment(AJS.$("#event-dialog-begin-date").val())
            eventProperties.eventEndDate = moment(AJS.$("#event-dialog-end-date").val())
    }

    doError = function({
        title,
        body
    }) {
        AJS.flag({
            type: 'error',
            title: title,
            body: body
        });
    }

    validateTitle = function(){
        if (eventProperties.eventTitle.length < 1) {
            errorFlag = true
            doError({
                title: 'Invalid event title',
                body: 'Please provide a valid event title'
            })
        }
    }

    validateDateSpan = function(){
        if (eventProperties.eventEndDate.isBefore(eventProperties.eventBeginDate)) {
                errorFlag = true 
                doError({
                   title: 'Invalid date range',
                   body: "The end date for this event can't be after the beginning date"
                })
        }
    }

    return{
        validateFormFields : function() {
            reset()
            /****************
             * 	returns a new calendar event if dialog data is valid
             * 	**************************/
            readFormValues()
            validateTitle()
            validateDateSpan()
            if(errorFlag === false){
                return calendarEvents.newCalendarEvent({
                    beginDate: eventProperties.eventBeginDate, 
                    endDate: eventProperties.eventEndDate, 
                    title: eventProperties.eventTitle, 
                    description: eventProperties.eventDescription, 
                    categoryID: eventProperties.eventCategory})
            }
        }
    }
})() 

const eventDialogUI = (function() { 
        let uiEventDialog, dialogAction,
        calendar,
        eventBeginDateField, eventEndDateField,
        dateStampToDate,
        calendarBlankEvent,
        setEventFormValues,
        setEventDialogHeader,
        registerNewEventFromFormValues,
        editEventFromFormValues,
        eventAsHTMLListItem,
        saveChanges, changeType

    uiEventDialog = ui.newUI({
        submitFormValues: "dialog-submit-button",
        dialogCancel: "dialog-cancel-button"
    })

    changeType = {
        newEvent: 10,
        editEvent: 20, 
        deleteEvent: 30
    }

    eventBeginDateField = "#event-dialog-begin-date"
    eventEndDateField = "#event-dialog-end-date"

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
    }

    setEventFormValues = function(ev) {
        //sets the value of the form to the event passed on as argument
        if(ev.categoryID && ev.categoryID === 1){
            AJS.$("#important-event").prop('checked', true)
        }
        else{
            AJS.$("important-event").prop('checked', false)
        }
        AJS.$(eventBeginDateField).val(ev.timeSpan.beginDate.format('YYYY-MM-DD'));
        AJS.$(eventEndDateField).val(ev.timeSpan.endDate.format('YYYY-MM-DD'));
        AJS.$("#event-dialog-title").val(ev.eventTitle);
        AJS.$("#event-dialog-description").val(ev.eventDescription);
    }

    setEventDialogHeader = function(headerTitle) {
        AJS.$("#event-dialog-action").text(headerTitle);
    };

    registerNewEventFromFormValues = function(e) {
        /********************************************************
         * collects the values entered in the form, validates them, 
         * and if valide, registers new event in calendar 
         * *****************************************************/
        e.preventDefault();
        let newCalendarEvent = eventFormValidator.validateFormFields();
        if (newCalendarEvent !== undefined) {
            calendar.register(newCalendarEvent);
            saveChanges(changeType.newEvent);
        }
    };

    editEventFromFormValues = function(e) {
        e.preventDefault();
        let newCalendarEvent = eventFormValidator.validateFormFields();
        if (newCalendarEvent !== undefined) {
            let registeredEvent = calendar.get(dialogAction.id);
            registeredEvent.timeSpan = newCalendarEvent.timeSpan;
            registeredEvent.eventTitle = newCalendarEvent.eventTitle;
            registeredEvent.eventDescription = newCalendarEvent.eventDescription;
            registeredEvent.categoryID = newCalendarEvent.categoryID
            saveChanges(changeType.editEvent);
        }
    };

  
    eventAsHTMLListItem = function(ev) {
        return `<li>${JSON.stringify(ev)}</li>`;
    };

    saveChanges = function(change) {
        let eventsAsHTMLList, jsonData, newBody, userMessage

        eventsAsHTMLList = [`<li>${bambi.getVersionString()}</li>`];
        calendar.forEach(ev => eventsAsHTMLList.push(eventAsHTMLListItem(ev)))
        eventsAsHTMLList.push('<li>init</li>')

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
        userMessage = "Saving your changes"
        switch(change){
            case changeType.newEvent:
                userMessage = 'Saving new event'
                break
            case changeType.editEvent:
                userMessage = 'Editing event'
                break
            case changeType.deleteEvent:
                userMessage = 'Deleting event'
                break
        }

        AJS.flag({
            type: 'info',
            title: userMessage, 
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
            console.log("eventDialog init")
            calendar = cal
            eventCategories.listCategoriesLabel().forEach(
                catDescription => AJS.$("#category-select").append(`<option>${catDescription.label}</option>`))

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
            saveChanges(changeType.deleteEvent);
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
            dialogAction = eventDialogUI.dialogActions.create
            setEventDialogHeader("Creating new event")
            if (dayStamp === undefined) {
                dateUtils.pushSeparator("-")
                dayStamp = dateUtils.dayStamp()
                dateUtils.popSeparator()
            }
            let ev = calendarBlankEvent(dayStamp);
            setEventFormValues(ev);
            ui.assignAction({
                triggerHandle: uiEventDialog.submitFormValues,
                action: registerNewEventFromFormValues
            });

            AJS.dialog2("#event-dialog").show()
        },

        publish: function(ev) {
            console.log("publishing event to page" + ev.eventTitle)
            validateFormInfo();
        }
    }
})()


module.exports = {
    eventDialogUI
}
