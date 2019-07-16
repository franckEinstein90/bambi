/******************************************************************************
 * calendarUI.js
 * ----------------
 *  includes modules 
 *  - eventsUI: all to do with the events view
 *  - calendarSideBarUI: 
 *  - calendarUI: all to do with the calendar event
 * ***************************************************************************/
const appData = require('./bambi.js').bambi.clientData;

const calendarSettings = require('./calendarSettings.js').calendarSettings;
const dateUtils = require('./dateUtils/dateUtils').dateUtils;

const ui = require('./ui.js').ui;
const eventDialogUI = require('./eventDialogUI.js').eventDialogUI;
const moment = require('moment');

const calendarUIChrome = (function() {
    let uiCalendar,
        setCalendarTitle = () => {
            let calendarTitle =
                dateUtils.monthIdxToStr(calendarSettings.selectedMonth()) + " " +
                calendarSettings.selectedYear();
            uiCalendar.calendarTitle.html("<h1>" + calendarTitle + "</h1>");
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

    let uiCalendar,
        rowHeight,

        DisplayedDay, 
        displayedDays; 

        /**************************** */
        DisplayedDay = function(dayID, eventArray){
            this.dayID = dayID;
            this.events = eventArray;
        };
        displayedDays = [];
        /**************************** */

        let displayedEventsEditIds = [],

        eventInlineControl = function(listItemID, calendarEvent) {
            let editID = new EditEventID(listItemID, calendarEvent.id),
                deleteID = "delete" + listItemID,
                toolbar = '<div style="text-align:right">' +
                '<span ID="' + editID.htmlEditID + '" class="event-edit-btn aui-icon aui-icon-small aui-iconfont-edit">' +
                'Edit event</span>&nbsp;&nbsp;' +
                '<span ID="' + editID.htmlDeleteID + '" class="event-edit-btn aui-icon aui-icon-small aui-iconfont-delete">Delete event</span>' +
                '</div>',
                description = calendarEvent.eventDescription === "" ? "No Description" : calendarEvent.eventDescription;
            //add the edit and delete icons to the corresponding arrays
            displayedEventsEditIds.push(editID);
            return "<aui-inline-dialog id='" + listItemID + "' style='width:200px'>" + toolbar +
                "<p>" + calendarEvent.eventTitle + "</p><p>" + description + "</p></aui-inline-dialog>";
        },

        dayCell = function(calendar, {dayID, events}) {
            //returns an html TD that displays the day and its events
            let cssClasses,
                cellClass,
                cellEvents,

                cellHeader,
                dayLabel, 
                dayCommands, 
                
                isToday, 
                isInThisMonth, 
                datePart;

            datePart = dayID.split("-");

            dayCommands = `<span class='event-edit-btn aui-icon aui-icon-small aui-iconfont-add'>Add an event at this date</span>`;
            dayCommmands = `<DIV class='dayCommands'>${dayCommands}</DIV>`;
            cellHeader = `<DIV class='dayCellHeader'><DIV class='dayLabel'>${datePart[2]}</DIV>${dayCommands}</DIV>`;
 

            cellEvents = `<DIV class='dayCellEvents'><UL><LI>fd</LI></UL></DIV>` ;
            isToday = (parseInt(datePart[0]) === dateUtils.today.year) &&
                        (parseInt(datePart[1]-1) === dateUtils.today.month) &&
                        (parseInt(datePart[2]) === dateUtils.today.day);
            isInThisMonth =  parseInt(datePart[1] - 1) === calendarSettings.selectedMonth();
            cssClasses = {
                    today: "today",
                    monthDay: "monthDay",
                    nonMonthDay: "nonMonthDay"
                };
            
 		    if(isToday){
		        cellClass = cssClasses.today;
		    } else if (isInThisMonth) {
                cellClass = cssClasses.monthDay;
            } else {
                cellClass = cssClasses.nonMonthDay;
            }


 
            return  `<TD class='${cellClass}' ID='${dayID}'> ${cellHeader}${cellEvents}</TD>`;

          /* 
            
            return cell("<TD class='" + cssClass + "'>" + "<span ID ='" + dayID + "'>" + dayID.slice(-2) +
            "&nbsp;&nbsp;<span class='event-edit-btn aui-icon aui-icon-small aui-iconfont-add'>Add an event at this date</span>" +
            "</span><ul>" + eventList + "</ul></TD>";
 
		eventsDayIds = eventsOnDay.map(ev => new ui.DayEvent({dayStamp:dayID, eventID:ev.id})),
                eventList = "",
               makeListItem = function(calendarEvent) {
                    let listItemID = "ev_id_day_" + dayID + "_" + calendarEvent.id;
                    eventList += "<li><a data-aui-trigger aria-controls='" + listItemID + "'>" + calendarEvent.eventTitle + "</a></li>";
                    eventList += eventInlineControl(listItemID, calendarEvent);
                }

            eventsOnDay.forEach(makeListItem);*/
       },

        addCalendarBodyRow = function(rowContent) { //renders a single calendar row
            uiCalendar.calendarBody.append("<TR class='weekRow' style='height:" + rowHeight + "px'>" + rowContent + "</TR>");
        },

        layoutMonth = function(weekRow, calendar) { 
	    //lays out the rows to be rendered in the displayedDays array
            let days = [], 
	      	    addNewDays = function() {
                    let eventsOnDay = function(dayID) {
                        return calendar.filter(ev => ev.timeSpan.includes(dayID))
                     }; 
	    		displayedDays.push(days.map(dayID => new DisplayedDay(dayID, eventsOnDay(dayID))));
		    };

            if (weekRow === 1) {
                this.firstDate = moment({
                    year: calendarSettings.selectedYear(),
                    month: calendarSettings.selectedMonth(),
                    day: 1
                });

                let firstDayIDX = calendarSettings.firstDay().weekDayIdx;

                if (firstDayIDX > 0) {
                    let lastDate = moment({
                        year: calendarSettings.selectedYear(),
                        month: calendarSettings.selectedMonth(),
                        day: 1
                    });
                    for (let i = 0; i < firstDayIDX; i++) {
                        lastDate.subtract(1, "days");
                        days.push(lastDate.format("YYYY-MM-DD"));
                    }
                    days.reverse();
                }
                for (let i = firstDayIDX; i <= 6; i++) {
                    days.push(firstDate.format("YYYY-MM-DD"));
                    firstDate.add(1, "days");
                }
		addNewDays();
                return; //end layout first row
            }
            for (let i = 0; i <= 6; i++) {
                days.push(firstDate.format("YYYY-MM-DD"));
                firstDate.add(1, "days");
            }
	    addNewDays();
        },

        addEventControlHandlers = function() {
	    //controlers to add a new event on this day
            displayedDayIds.forEach( row => row.forEach(id => AJS.$("#" + id).click(x => eventDialogUI.showNew(id)))); //add eventListener to each added days
	    //controlers to edit an event displayed on this day
            displayedEventsEditIds.forEach(evID => AJS.$("#" + evID.htmlEditID).click(x => eventDialogUI.showEdit(evID.eventID)));
       	    //controlers to delete an event displayed on this day
            displayedEventsEditIds.forEach(evID => AJS.$("#" + evID.htmlDeleteID).click(x => eventDialogUI.deleteEvent(evID.eventID)));
         }

    return {
        onReady: function(uic) {
            uiCalendar = uic;
        },

        update: function(calendar) {
            let numRows,
                containerHeight = AJS.$("#calendar-container").height() -
                AJS.$("#calendar-container-header").height() -
                AJS.$("#calendar-table-header").height() -
                AJS.$("#calendar-table-footer").height();

            numRows = 5;
            rowHeight = containerHeight / numRows;

            //reset the ids arrays to be associated with events
            displayedDays.length = 0;
            displayedEventsEditIds.length = 0;

            uiCalendar.calendarBody.empty();
            for (let weekRow = 1; weekRow <= numRows; weekRow++) {
                layoutMonth(weekRow, calendar);
            }

	        //render each calendar row
            displayedDays.forEach(
                    x => addCalendarBodyRow(x.map(day => dayCell(calendar, day)).join("")));

            addEventControlHandlers();
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
