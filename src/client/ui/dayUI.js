"use strict";
/******************************************************************************
 * calendarUI.js
 * ----------------
 *  includes modules 
 *  - eventsUI: all to do with the events view
 *  - calendarSideBarUI: 
 *  - calendarUI: all to do with the calendar event
 * ***************************************************************************/
const appData = require('../../bambi.js').bambi.clientData;

const calendarSettings = require('../calendarSettings.js').calendarSettings;
const dateUtils = require('../dateUtils/dateUtils').dateUtils;

const ui = require('./ui.js').ui;
const eventDialogUI = require('./eventDialogUI.js').eventDialogUI;
const moment = require('moment');

const dayUI = (function() { 
    let DisplayedDay, DayEventProperties, eventsOnDay; 

    DisplayedDay = function(dayID, eventArray){
        this.dayID = dayID;
        this.htmlEventAddID = `add_event${dayID}`;
        this.events = eventArray;
    };
    DayEventProperties = function({dayStamp, event}) {
        this.label = event.eventTitle;
        this.description = event.eventDescription === ""?"No Description":event.eventDescription;
        this.listItemId = "evId_Day_" + dayStamp + "_" + event.id;  
        this.eventID = event.id;
        this.dateStamp = dayStamp;
        this.htmlEditID = "edit_" + this.listItemId;
        this.htmlDeleteID = "delete_" + this.listItemId;
    };
    eventsOnDay = function(dayID, calendar) {
        let events = calendar.filter(ev => ev.timeSpan.includes(dayID));
        return events.map(ev => new DayEventProperties({dayStamp:dayID, event:ev}));
    }; 
    return {
        contextualize : function(dayArray, calendar){
            return dayArray.map(dayID => new DisplayedDay(dayID, eventsOnDay(dayID, calendar)));
        }
    }
})();

module.exports = {
    dayUI
};