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

const calendarUIChrome = (function() {
    let uiCalendar,
        setCalendarTitle = () => {
            let calendarTitle =
                dateUtils.monthIdxToStr(calendarSettings.month()) + " " +
                calendarSettings.year();
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
            document.dateChooser.chooseMonth.selectedIndex = calendarSettings.month();
            document.dateChooser.chooseYear.selectedIndex = calendarSettings.yearIdx();
        }
    }
})();


const calendarInnerTable = (function() {

    let uiCalendar,
	displayedDayIds = [],
        addCalendarBodyRow = function(rowClass, rowContent) {
            uiCalendar.calendarBody.append(
                "<TR class='" + rowClass + "'>" + rowContent + "</TR>");
        },
	insertDayId = function(day){ //create a new day ID and inserts it into the displayedDayIds array
		dateUtils.setSeparator("-");
		let id = dateUtils.dayStamp(calendarSettings.year(), calendarSettings.month(), day);
		displayedDayIds.push(id);
		return id;
	},
	dayCell = function(calendar, day){
		let cssClass = (dateUtils.today.monthIDX === day && calendarSettings.current())? "today" : "day",
		    eventsOnDay = calendar.filter(ev => 
			ev.timeSpan.includes(new Date(calendarSettings.year(), calendarSettings.month(), day))),
		    eventList = "", 
		    description = function(ce) {return ce.eventDescription === ""?"No Description":ce.eventDescription}, 
		    makeListItem = function(calendarEvent) {
			let listItemID = "ev_id_day_"+ day + "_" + calendarEvent.id; 
			eventList += "<li><a data-aui-trigger aria-controls='" + listItemID + "'>" + 
				      calendarEvent.eventTitle + "</a></li>";
			eventList += "<aui-inline-dialog id='" + listItemID + "'>" + description(calendarEvent) + "</aui-inline-dialog>";
		    }
            	eventsOnDay.forEach(makeListItem);
		return  "<TD class='" + cssClass + "'>" + "<span ID ='" + insertDayId(day) + "'>" +  
			day.toString().padStart(2, '0')  +   
			"&nbsp;&nbsp;<span class='aui-icon aui-icon-small aui-iconfont-add'>Add an event at this date</span>"+
			"</span><ul>"+ eventList + "</ul></TD>"; 

	},
        addWeekRow = function(calendar, dayCounter) {
            let howMany = calendarSettings.monthLength(),
                weekRow = "",
                firstDay = calendarSettings.firstDay(),
                localDayCounter = dayCounter;
            for (let i = 0; i < 7 && localDayCounter <= howMany; i++) {
                if ((AJS.$("#calendar-table-body tr").length >= 1) || (i >= firstDay.weekDayIdx)) { //are we within the month?
                    weekRow += dayCell(calendar, localDayCounter); 
                    localDayCounter += 1;
                } else {
                    weekRow += "<td class='day'>&nbsp;</td>";
                }
            }
            addCalendarBodyRow("week-row", weekRow);
	    addEventRow(calendar, dayCounter, localDayCounter -1);
            return localDayCounter;
        },
	addEventRow = function(calendar, dayBegin, dayEnd){
		addCalendarBodyRow("event-row", "<td colspan=7>&nbsp;</td>");
	}
    return {
        onReady: function(uic) {
            uiCalendar = uic;
        },
        update: function(calendar) {
            let firstDay = calendarSettings.firstDay(),
                howManyDays = calendarSettings.monthLength(),
                dayCounter = 1;
            uiCalendar.calendarBody.empty();
            while (dayCounter <= howManyDays) {
                dayCounter = addWeekRow(calendar, dayCounter);
            }
	    displayedDayIds.forEach(id => AJS.$("#" + id).click(x => eventDialogUI.showNew(id))); //add eventListener to each added days
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
            ui.assignAction({
                triggerHandle: uiCalendar.createNewEvent,
                action: (e) => {
                    e.preventDefault();
                    eventDialogUI.showNew();
                }
            });
            AJS.$("#dateChooser").change(function() {
                let theMonth = document.dateChooser.chooseMonth.selectedIndex,
                    yearIDX = document.dateChooser.chooseYear.selectedIndex,
                    theYear = parseInt(document.dateChooser.chooseYear.options[yearIDX].text);
                calendarSettings.set(theYear, theMonth);
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
            calendarSettings.set();
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
