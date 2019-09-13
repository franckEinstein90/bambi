"use strict";
/******************************************************************************
 * dayUI.js
 * ----------------
 * Objects that link time span to events
 * ***************************************************************************/

const calendarSettings = require('../calendarSettings.js').calendarSettings;
const dateUtils = require('../time/dateUtils').dateUtils;

const ui = require('../ui.js').ui;
const moment = require('moment');

const dayUI = (function() {
    let DisplayedDay, DayEventProperties, renderEventPane

    DisplayedDay = function(dayID, eventArray) {
        this.dayID = dayID;
        this.htmlEventAddID = `add_event${dayID}`;
        this.events = eventArray;
    }

    DayEventProperties = function({
        dayStamp,
        event
    }) {
        this.label = event.eventTitle;
        this.description = event.eventDescription === "" ? "No Description" : event.eventDescription;
        this.listItemId = "evId_Day_" + dayStamp + "_" + event.id;
        this.eventID = event.id;
        this.dateStamp = dayStamp;
        this.category = event.categoryID; 
        this.htmlEditID = "edit_" + this.listItemId;
        this.htmlDeleteID = "delete_" + this.listItemId;
    }

    renderEventPane = function(eventInfo){ 
    //renders a pane for a single event
            let eventPaneStyle, eventLabelStyle
            eventPaneStyle = "cursor:pointer"
            eventLabelStyle = "cursor:pointer"

            if(eventInfo.category === 1){
                eventPaneStyle += ";background-color:#66152d;  font-weight:bold;"
                eventLabelStyle += ";color:#FFFFFF"
            }

            return [
                `<div class="dayEvent" style="${eventPaneStyle}">`,
                `<A data-aui-trigger aria-controls='${eventInfo.listItemId}' style="${eventLabelStyle}">`,
                 eventInfo.label,
                "</A>",
                `<aui-inline-dialog id='${eventInfo.listItemId}' style='width:200px'>`,
                    "<DIV style='text-align:right'>",
                        `<SPAN ID='${eventInfo.htmlEditID}' class='event-edit-btn aui-icon aui-icon-small aui-iconfont-edit'>`,
                        "Edit Event",
                        "</span>",
                        `<SPAN ID='${eventInfo.htmlDeleteID}' class='event-edit-btn aui-icon aui-icon-small aui-iconfont-delete'>`,
                        "Delete Event",
                        "</span>",
                        `<P>${eventInfo.label}</P>`,
                        `<P>${eventInfo.description}</P>`,
                    "</DIV>",
                "</aui-inline-dialog>",
                "</DIV>"
                    ].join("")
        }
    
    return {

        eventsOnDay: function(dayID, calendar) {
            //Given a calendar and a dayID, returns
            //a DayEventProperties object
            let events = calendar.filter(ev => ev.timeSpan.includes(dayID));
            return events.map(ev => new DayEventProperties({
                dayStamp: dayID,
                event: ev
            }));
        },

        contextualize: function(dayArray, calendar) {
            return dayArray.map(dayID => new DisplayedDay(dayID, dayUI.eventsOnDay(dayID, calendar)));
        }, 

      
        renderEventsPane: function({maxEvents, dayProperties}){ 
        //Draws the event section of a day cell in the calendar
            let cellEvents, numberOfEvents
            cellEvents  = "No Events Today"
            numberOfEvents = dayProperties.events.length 
            if (numberOfEvents > 0){ 
                cellEvents = dayProperties.events.slice(0, maxEvents).map(evInfo => renderEventPane(evInfo)).join("");
                let expandPaneID = `${dayProperties.dayID}_EventsExpander`
                cellEvents = [
                    `<div class="dayEventsPane">`, 
                    cellEvents, 
                    "</div>",
                    ].join('')
                if(numberOfEvents > maxEvents){
                    let jsCollapsableCode = [
                        `AJS.$(".collapsedDayEvents").css("display", "none")`,
                        `AJS.$(".expandEventsLink").css("display", "block")`,
                        `document.getElementById("${expandPaneID}Control").style.display="none"`,
                        `document.getElementById("${expandPaneID}").style.display="block"`
                    ].join(';')

                    cellEvents += [
                        `<A id='${expandPaneID}Control' class="expandEventsLink" onclick='${jsCollapsableCode}'>`,
                        `${numberOfEvents - maxEvents} more</a>`,
                        `<div id="${expandPaneID}"  class= "collapsedDayEvents" style="display: none">`, 
                        dayProperties.events.slice(maxEvents).map(evInfo => renderEventPane(evInfo)).join(""),
                        `</div>`].join('')
                }
            }
            return cellEvents
        },

        evHandler: function(){

        }
    }
})();

module.exports = {
    dayUI
};
