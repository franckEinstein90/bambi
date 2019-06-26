const appData = require('./bambi.js').bambi.clientData;

const calendarSettings = require('./calendarSettings.js').calendarSettings;
const dateUtils = require('./dateUtils/dateUtils').dateUtils;
const moment = require('moment');

const ui = require('./ui.js').ui;

const calendarSideBarUI = (function() {
    let uiSideBar = ui.newUI({
            sideBarHeading: "sidebar-heading"
        }),
        sidebarTitle = () => appData["weekDays"][dateUtils.today.weekIDX] + " " + dateUtils.today.monthIDX;
    return {
        onReady: function(calendar) {
            try {
                uiSideBar.sideBarHeading.text(sidebarTitle());
            } catch (e) {
                console.log("error " + e);
                throw e;
            }
        }
    }
})();

module.exports = {
    calendarSideBarUI,
};
