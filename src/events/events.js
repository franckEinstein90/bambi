/******************************
 * Includes all initialization functions
 * ***************************/

"use strict";


const bambi = require('../bambi.js').bambi
const confluencePage = require('../confluencePage/confluencePage').confluencePage
const events = require('../events/events.js').events
const calendarSideBarUI = require('../calendarSideBarUI').calendarSideBarUI
const calendarUI = require('../calendarUI').calendarUI
const eventDialogUI = require('../eventDialogUI').eventDialogUI

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



const pageContainer = (function() {

    let calendar, calendarInformationRows, initPage;

    calendar = new events.Registrar();
    //Reads each line of calendar information
    //stored on the page
    calendarInformationRows = function() {
        // Collects list items on page that can be converted to 
        // calendar events and returns all as an array
        let eventDescriptions = [];
        AJS.$("H1:contains('Events') + ul li").each(function(index) {
            eventDescriptions.push($(this).text());
        });
        return eventDescriptions;
    };
    initPage = function() {
        AJS.$("H1:contains('Events') + ul").hide();
        AJS.$("H1:contains('Events')").hide();
    };
    return {
        Command: function(execute, undo, value) {
            this.execute = execute;
            this.undo = undo;
            this.value = value;
        },

        onReady: function() {
            confluencePage.updateMatchers()
            //extract and process all calendar information stored on the page 
            let calendarInfo = calendarInformationRows();
            calendarInfo.forEach(str => confluencePage.processCalendarInformation(calendar, str));
            initPage();
            eventDialogUI.onReady(calendar);
            calendarSideBarUI.onReady(calendar);
            calendarUI.onReady(calendar);
        }
    }
})()

module.exports = {
    pageContainer
}