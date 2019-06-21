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


const eventsUI = (function() {

    let uiEvents = ui.newUI({
            eventlistpane: "eventlist"
        }),
        div = (htmlClass, content) => `<div class='${htmlClass}'>${content}</div>`,
        controlIcon = function(icon, controlID, accessibilityText) {
            let tag = `<span class='aui-icon aui-icon-small ${icon} event-edit-btn' `;
            tag += `id='${controlID}'>${accessibilityText}</span>`;
            return tag;
        },

        eventControls = function(eventID) {
            let editButton = `${controlIcon('aui-iconfont-edit', eventID+"-edit", "modify this event")}`,
                deleteButton = `${controlIcon('aui-iconfont-delete', eventID+"-delete", "delete this event")}`;
            return `<div class='event-controls'>${editButton}${deleteButton}</div>`;
        },

        renderEventPane = function({
            id,
            timeSpan,
            eventTitle,
            eventDescription,
            eventState
        }) {
            let formatDate = (date) => date.getFullYear() + "/" +
                date.getMonth() + "/" +
                date.getDate(),
                dateHeader = formatDate(timeSpan.beginDate) + " to " + formatDate(timeSpan.endDate),
                htmlStr =
                div('hidden', id) + div('eventTitle', eventTitle) +
                eventControls(id) + div('event-dates', dateHeader);
            htmlStr = div('eventHeaderRow', htmlStr);
            if (eventDescription) {
                let divBodyID = `eventDescription-${id}`;
                htmlStr += `<div id='${divBodyID}' class='aui-expander-content'>${eventDescription}</div>`;
                htmlStr += `<a id='replace-text-trigger' data-replace-text='Read less' class='aui-expander-trigger'`;
                htmlStr += ` aria-controls='${divBodyID}'>Read more</a>`;
            }
            return div('event-view', htmlStr);
        },

        rendereventsview = (calendar) => {
            eventList = AJS.$("#eventlist");
            calendar.forEach(calendarEvent => eventList.append(renderEventPane(calendarEvent)));
        };

    return {

        onReady: (calendar) => {
            try {
                rendereventsview(calendar);
            } catch (e) {
                console.log(e);
                throw e + " at eventsUI.onReady";
            }
        }
    };

})();

module.exports = {
    eventsUI
};
