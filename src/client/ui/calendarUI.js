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

const ui = require('./ui').ui;
const dayUI = require('./dayUI').dayUI;
const eventDialogUI = require('./eventDialogUI').eventDialogUI;
const moment = require('moment');

const calendarUIChrome = (function() {
    let uiCalendar,
        setCalendarTitle = () => {
            uiCalendar.calendarTitle.html([ 
                `<H1 id='dateLabel'>`,
                `${dateUtils.monthIdxToStr(calendarSettings.selectedMonth())} ${calendarSettings.selectedYear()}`, 
                "</H1>"
            ].join(""));
        };

    return {

        onReady: (uic) => {
            uiCalendar = uic;
            let makeOption = (idx, value) => `<option value="${idx}">${value}</option>`,
                yearChooser = document.dateChooser.chooseYear;
            for (i = calendarSettings.beginYear; i < calendarSettings.endYear; i++) {
                yearChooser.options[yearChooser.options.length] = new Option(i, i);
            }
            appData['monthsEn'].forEach((month, idx) => AJS.$("#chooseMonth").append(makeOption(idx, month)));
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
        layoutMonth, addCalendarHTMLBodyRow, dayCell,//layout the dayCells and draw them
        addEventControlHandlers;

        /**************************** */
        displayedDays = [];
        rows = {
            numRows: 5, 
            rowHeight: 40
        };
        /**************************** */
        cols = {
            numCols: 7
        };
        dayCell = function(dayProperties){
            //returns and html TD that displays the day and its events
            let datePart, 
                cellEvents, cellHeader, 
                isToday, isInThisMonth, 
                cssClasses,
                cellClass;
    
            datePart = dayProperties.dayID.split("-");
            cellEvents = "No events today";
            if (dayProperties.events.length > 0){
                let listItem = function(eventInfo){
                    return [    "<LI style='list-style-type:none'>", 
                                    `<A data-aui-trigger aria-controls='${eventInfo.listItemId}' style="cursor:pointer">`,
                                    "- " + eventInfo.label, 
                                    "</A>",
                                `<aui-inline-dialog id='${eventInfo.listItemId}' style='width:200px>`,
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
                                "</aui-inline-dialog></LI>"].join("");
                };
                cellEvents = dayProperties.events.map(evInfo => listItem(evInfo)).join("");
                cellEvents = `${cellEvents}`;
            }
            cellHeader = [
                    `<div> <span class='dayLabel'>${datePart[2]}</span>`,
                    `<span class='dayCommands'>`,
                        `<span class='event-edit-btn aui-icon aui-icon-small aui-iconfont-add' ID='${dayProperties.htmlEventAddID}'>`,
                            `Add an event at this date`,
                        `</span>`,
                    `</span></div>`].join("");
    
            cssClasses = {
                today: "today",
                monthDay: "monthDay",
                nonMonthDay: "nonMonthDay"
            };
    
            isToday =   (parseInt(datePart[0])===dateUtils.today.year) && 
                        (parseInt(datePart[1]-1) === dateUtils.today.month) &&
                        (parseInt(datePart[2]) === dateUtils.today.day);
            isInThisMonth = parseInt(datePart[1] - 1) === calendarSettings.selectedMonth();
            cellClass = isToday? cssClasses.today : (isInThisMonth? cssClasses.monthDay:cssClasses.nonMonthDay);
    
            return [    `<TD class='${cellClass}' ID='${dayProperties.dayID}'>`, 
                            "<DIV class='dayCellHeader'>",
                            cellHeader,
                            "</DIV><HR>",
                            "<DIV class='dayCellEvents'>",
                                cellEvents,
                            "</DIV>",
                        "</TD>"].join("");
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
            while(days.length < cols.numCols){
                days.push(currentSelectedDate.format("YYYY-MM-DD"));
                currentSelectedDate.add(1,"days");
            }
            return days;
        };
        addCalendarHTMLBodyRow = function(dayRow){
            let rowContent = dayRow.map(x => dayCell(x)).join("");
            uiCalendar.calendarBody.append(`<TR class='weekRow' style='height:${rows.rowHeight}px'>${rowContent}</TR>`);
        };
        addEventControlHandlers = function() {
        };

    return {
        onReady: function(uic) {
            uiCalendar = uic;
        },

        update: function(calendar) {
            try{
                let containerHeight = AJS.$("#calendar-container").height() -
                    AJS.$("#calendar-container-header").height() -
                    AJS.$("#calendar-table-header").height() -
                    AJS.$("#calendar-table-footer").height();

                rows.rowHeight = containerHeight / rows.numRows;
                //reset the ids arrays to be associated with events
                displayedDays.length = 0; 
                //remove the rows on display if any
                uiCalendar.calendarBody.empty();
                for (let weekRow = 1; weekRow <= rows.numRows; weekRow++) {
                    displayedDays.push(dayUI.contextualize(layoutMonth(weekRow), calendar));
                }
                //display the days row by row
                displayedDays.forEach(dayRow => addCalendarHTMLBodyRow(dayRow));
            } catch(e){
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
            previousMonth: "select-previous-month",
            nextMonth: "select-next-month",
            createNewEvent: "dialog-show-button"
        }),

        assignActions = (calendar) => {
            ui.assignAction({
                triggerHandle: uiCalendar.previousMonth,
                action: x => calendarSettings.previousMonth(),
                postProcess: x => update(calendar)
            });

            ui.assignAction({
                triggerHandle: uiCalendar.nextMonth,
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
                update(calendar);
            });
        },

        update = (calendar) => {
            calendarUIChrome.update();
            calendarInnerTable.update(calendar);
        },

        renderCalendarFrame = () => {
            let weekdaysHeader = "";
            appData["weekDaysAbbrEn"].map( //add the days of the week to the calendar's chrome
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
