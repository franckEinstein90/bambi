"use strict";
/******************************************************************************
 * calendarUI.js
 * ----------------
 *  includes modules 
 *  - eventsUI: all to do with the events view
 *  - calendarSideBarUI: 
 *  - calendarUI: all to do with the calendar event
 * ***************************************************************************/
const bambi = require('../bambi.js').bambi;

const calendarSettings = require('../calendarSettings.js').calendarSettings;
const dateUtils = require('../time/dateUtils').dateUtils;

const ui = require('../ui.js').ui;
const dayUI = require('./dayUI.js').dayUI;
const moment = require('moment');


/**********************************
 * Control and settings dialogs
 **********************************/
const eventDialogUI = require('../dialogs/eventDialogUI.js').eventDialogUI
const settingsDialog = require('../dialogs/settings').settingsDialog

const calendarUIChrome = (function() {
    let uiCalendar,setCalendarTitle, setAppVersionInfo; 

    setCalendarTitle = () => {
            let calendarTitle =
                dateUtils.monthIdxToStr(calendarSettings.selectedMonth()) + " " +
                calendarSettings.selectedYear();
            uiCalendar.calendarTitle.fadeTo(500, 1.0);
            uiCalendar.calendarTitle.html("<h1 ID='dateLabel'>" + calendarTitle + "</h1>");
        };

    setAppVersionInfo = ()=> {
        uiCalendar.versionInfo.html(bambi.getVersionString());
    }
    return {

        onReady: (uic) => {
            uiCalendar = uic;
            setAppVersionInfo(); 
            let makeOption = (idx, value) => `<option value="${idx}">${value}</option>`,
                yearChooser = document.dateChooser.chooseYear;
            for (let i = calendarSettings.beginYear; i < calendarSettings.endYear; i++) {
                yearChooser.options[yearChooser.options.length] = new Option(i, i);
            }
            bambi.clientData['monthsEn'].forEach((month, idx) => AJS.$("#chooseMonth").append(makeOption(idx, month)));
        },

        update: () => {
            setCalendarTitle();
            document.dateChooser.chooseMonth.selectedIndex = calendarSettings.selectedMonth();
            document.dateChooser.chooseYear.selectedIndex = calendarSettings.yearIdx();
        }
    }
})();



const calendarInnerTable = (function() {

    let uiCalendar, displayedDays,
        rows, cols,
        currentSelectedDate,
        layoutMonth,
        addCalendarHTMLBodyRow,
        dayCell, 
        addEventControlHandlers

    displayedDays = [];
    rows = {
        numRows: 5,
        rowHeight: 40
    };
    cols = {
        numCols: 7
    };

    layoutMonth = function(weekRow) {
        //returns an array of html cells representing the days for a given row of the calendar
        let days = [];

        if (weekRow === 1) {
            currentSelectedDate = moment({
                year: calendarSettings.selectedYear(),
                month: calendarSettings.selectedMonth(),
                day: 1
            });
            let firstDate = currentSelectedDate.clone();
            for (let i = 0; i < calendarSettings.firstDay().weekDayIdx; i++) {
                firstDate.subtract(1, "days");
                days.push(firstDate.format("YYYY-MM-DD"));
            }
            days.reverse();
        }
        while (days.length < cols.numCols) {
            days.push(currentSelectedDate.format("YYYY-MM-DD"));
            currentSelectedDate.add(1, "days");
        }
        return days;
    }

  
    dayCell = function(dayProperties) {
        //returns and html TD that displays the day and its events
        let datePart , cellHeader,
            isToday, isInThisMonth,
            cssClasses,
            cellClass;

        datePart = dayProperties.dayID.split("-");
        cellHeader = [
            `<div> <span class='dayLabel'>${datePart[2]}</span>`,
            `<span class='dayCommands'>`,
            `<span class='event-edit-btn aui-icon aui-icon-small aui-iconfont-add' ID='${dayProperties.htmlEventAddID}'>`,
            `Add an event at this date`,
            `</span>`,
            `</span></div>`
        ].join("");

        cssClasses = {
            today: "today",
            monthDay: "monthDay",
            nonMonthDay: "nonMonthDay"
        };

        isToday = (parseInt(datePart[0]) === dateUtils.today.year) &&
            (parseInt(datePart[1] - 1) === dateUtils.today.month) &&
            (parseInt(datePart[2]) === dateUtils.today.day);
        isInThisMonth = parseInt(datePart[1] - 1) === calendarSettings.selectedMonth();
        cellClass = isToday ? cssClasses.today : (isInThisMonth ? cssClasses.monthDay : cssClasses.nonMonthDay);

        return [`<TD class='${cellClass}' ID='${dayProperties.dayID}'>`,
            "<DIV class='dayCellHeader'>",
            cellHeader,
            "</DIV><HR>",
            "<DIV class='dayCellEvents'>",
            dayUI.renderEventsPane({maxEvents:3, dayProperties}),
            "</DIV>",
            "</TD>"
        ].join("");
    }

    addCalendarHTMLBodyRow = function(dayRow) {
        let rowContent = dayRow.map(x => dayCell(x)).join("");
        uiCalendar.calendarBody.append(`<TR class='weekRow' style='height:${rows.rowHeight}px'>${rowContent}</TR>`);
    }

    addEventControlHandlers = function() {
        //adds handlers for all rendered cells
        let addDayCellHandlers = function(dayCell) {
            AJS.$("#" + dayCell.htmlEventAddID).click(
                x => eventDialogUI.showNew(dayCell.dayID));
            dayCell.events.forEach(dayEvent => AJS.$("#" + dayEvent.htmlEditID).click(
                x => eventDialogUI.showEdit(dayEvent.eventID)));
            dayCell.events.forEach(dayEvent => AJS.$("#" + dayEvent.htmlDeleteID).click(
                x => eventDialogUI.deleteEvent(dayEvent.eventID)));
        }
        displayedDays.forEach(dayRow => dayRow.forEach(addDayCellHandlers));
    }
    return {

        onReady: function(uic) {
            uiCalendar = uic;
        },

        update: function(calendar) {
            try {
                let containerHeight = AJS.$("#calendar-container").height() -
                    AJS.$("#calendar-container-header").height() -
                    AJS.$("#calendar-table-header").height() -
                    AJS.$("#calendar-table-footer").height();

                rows.rowHeight = containerHeight / rows.numRows;
                //reset the ids arrays to be associated with events
                displayedDays.length = 0;
                //remove all currently rendered rows

                uiCalendar.calendarBody.empty();

                for (let weekRow = 1; weekRow <= rows.numRows; weekRow++) {
                    displayedDays.push(dayUI.contextualize(layoutMonth(weekRow), calendar));
                }
                //render each calendar row
                displayedDays.forEach(dayRow => addCalendarHTMLBodyRow(dayRow));
                addEventControlHandlers();

            } catch (e) {
                console.log(e);
            }
        }
    }
})();

const calendarUI = (function() {

    let uiCalendar = ui.newUI({
            calendarTitle: "tableCalendar-title",
            weekdaysLabels: "calendar-table-weekdays-labels",
            calendarBody: "calendar-table-body",

            /**** settings dialog   *****/
            versionInfo: "app-version-info", 

            /**** calendar controls *****/
            showSettings: "app-settings",
            previousMonth: "select-previous-month",
            nextMonth: "select-next-month",
            createNewEvent: "dialog-show-button"
        }),

        assignActions = function(calendar) {
            let fadeOut; 
            fadeOut = x => {
                uiCalendar.calendarBody.fadeTo(500, 0.0);
                uiCalendar.calendarTitle.fadeTo(500, 0.0);
            };

            //settings dialog
            ui.assignAction({
                triggerHandle: uiCalendar.showSettings, 
                action: _ => settingsDialog.show()
            })

            ui.assignAction({
                triggerHandle: uiCalendar.previousMonth,
		        preProcess: fadeOut,
                action: x => calendarSettings.previousMonth(),
                postProcess: x => update(calendar)
            });

            ui.assignAction({
                triggerHandle: uiCalendar.nextMonth,
		        preProcess: fadeOut, 
                action: x => calendarSettings.nextMonth(),
                postProcess: x => update(calendar)
            });

            AJS.$("#dateChooser").change(function() {
                let theMonth = document.dateChooser.chooseMonth.selectedIndex,
                    yearIDX = document.dateChooser.chooseYear.selectedIndex,
                    theYear = parseInt(document.dateChooser.chooseYear.options[yearIDX].text);
                calendarSettings.set({
                    year: theYear,
                    month: theMonth,
                    day: 1
                });
                fadeOut();
                update(calendar);
            });
        },

        update = (calendar) => {
            calendarUIChrome.update();
		    uiCalendar.calendarBody.fadeTo(1000, 1.0);
            calendarInnerTable.update(calendar);
        },

        renderCalendarFrame = () => {
            let weekdaysHeader = "";
            bambi.clientData["weekDaysAbbrEn"].map( //add the days of the week to the calendar's chrome
                weekdayLabel => weekdaysHeader += `<td>${weekdayLabel}</td>`);
            uiCalendar.weekdaysLabels.html(weekdaysHeader);
        }
    return {
        onReady: (calendar) => {
            calendarUIChrome.onReady(uiCalendar);
            calendarInnerTable.onReady(uiCalendar);
            renderCalendarFrame();
            assignActions(calendar);
            update(calendar);
        }
    };
})();

module.exports = {
    calendarUI
};
