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
const moment = require('moment');


const ui = require('./ui.js').ui;
const eventDialogUI = require('./eventDialogUI.js').eventDialogUI;



const calendarUIChrome = (function() {
            let uiCalendar,
                setCalendarTitle;

            setCalendarTitle = function() {
                let calendarTitle =
                    dateUtils.monthIdxToStr(calendar.selectedMonth()) + " " + calendarSettings.selectedYear();
                uiCalendar.calendarTitle.html('<h1>' + calendarTitle + '</h1>');
            };

            return {
                onReady: function(uic){
                    uiCalendar = uic;
                }
            }
        })();

        const calendarUI = (function() {

            let uiCalendar;

	uiCalendar = ui.newUI({
                    calendarTitle: "tableCalendar-title",
                    weekdaysLabels: "calendar-table-weekdays-labels",
                    calendarBody: "calendar-table-body",
                    previousMonth: "select-previous-month",
                    nextMonth: "select-next-month",
                    createNewEvent: "dialog-show-button"
                });

                return {

                    onReady: (calendar) => {
                        calendarUIChrome.onReady(uiCalendar);
                    }
                };
        })();


        module.exports = {
            calendarUI,
        };
