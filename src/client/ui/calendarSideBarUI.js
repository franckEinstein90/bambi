const appData = require('../../bambi').bambi.clientData;

const calendarSettings = require('../calendarSettings').calendarSettings;

const dateUtils = require('../dateUtils/dateUtils').dateUtils;
const moment = require('moment');

const ui = require('./ui').ui;
const eventDialogUI = require('./eventDialogUI').eventDialogUI;


/*******************************************************************************
 * Controls the calendar's sidebar
 * *****************************************************************************/
const calendarSideBarUI = (function() {
    let uiSideBar = ui.newUI({
            calendarSidebar: "calendar-sidebar",
            sidebarInner: "sidebar-inner",
            sideBarHeading: "sidebar-heading",
            createNewDayEvent: "add-event-today"
        }),
        sidebarTitle = () => appData["weekDays"][dateUtils.today.weekIDX] + " " + dateUtils.today.monthIDX;
    return {
        onReady: function(calendar) {
                containerHeight = AJS.$("#calendar-container").height() -
                AJS.$("#calendar-container-header").height();
        try {
		AJS.$("#calendar-sidebar").css("height", containerHeight);
                AJS.$("#calendar-sidebar").html("<div class='sidebarInner' id='sidebar-inner'></div>");
                AJS.$("#sidebar-inner").append("<h2 id='sidebar-heading'>aaa</h2>");
                AJS.$("#sidebar-heading").html(sidebarTitle());
                AJS.$("#sidebar-inner").append("<button id='add-event-today' class='aui-button'>Add an event</button>");
                AJS.$("#add-event-today").click(function(e) {
                    e.preventDefault();
                    eventDialogUI.showNew();
                });
            } catch (e) {
                console.log("error " + e);
                throw e;
            }
        }
    }
})();


module.exports = {
    calendarSideBarUI
};
