/******************************************************************************
 * calendarUI.js
 * ----------------
 *  includes modules 
 *  - eventsUI: all to do with the events view
 *  - calendarSideBarUI: 
 *  - calendarUI: all to do with the calendar event
 * ***************************************************************************/
const calendarSettings = require('./calendarSettings.js').calendarSettings;
const dateUtils = require('./dateUtils.js').dateUtils;
const eventDialogController = require('./eventDialogController.js');
const appData = require('./appData.js').appData;
const ui = require('./ui.js').ui;

const calendarSideBarUI = (function() {
    let uiSideBar = ui.newUI({
            sideBarHeading: "sidebar-heading"
        }),
        today = new Date(),
        sidebarTitle = () => appData["weekDays"][today.getDay()] + " " + today.getDate();
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

const calendarUI = (function() {

    let uiCalendar = ui.newUI({
            calendarTitle: "tableCalendar-title",
            weekdaysLabels: "calendar-table-weekdays-labels",
            calendarBody: "calendar-table-body",
            previousMonth: "select-previous-month",
            nextMonth: "select-next-month",
            createNewEvent: "dialog-show-button"
        }),

        redrawUI = (calendar) => {
            renderCalendarFrame();
            renderCalendarBody(calendar);
        },

        renderCalendarFrame = () => {
            let weekdaysHeader = "";
            appData["weekDaysAbbrEn"].map( //add the days of the week to the calendar's chrome
                weekdayLabel => weekdaysHeader += `<td>${weekdayLabel}</td>`);
            uiCalendar.weekdaysLabels.html(weekdaysHeader);

            setCalendarTitle();
            setFormValues();
        },

        setCalendarTitle = () => {
            let calendarTitle =
                dateUtils.monthIdxToStr(calendarSettings.month()) + " " +
                calendarSettings.year();
            uiCalendar.calendarTitle.html("<h1>" + calendarTitle + "</h1>");
        },

        setFormValues = () => {
            document.dateChooser.chooseMonth.selectedIndex = calendarSettings.month();
            document.dateChooser.chooseYear.selectedIndex = calendarSettings.yearIdx();
        },

        renderCalendarBody = (calendar) => {
            uiCalendar.calendarBody.empty();
            populateCalendarTable(calendar);
        },

        populateCalendarTable = function(calendar) {
            let firstDay = calendarSettings.firstDay(),
                howMany = calendarSettings.monthLength(),
                dayCounter = 1;
            while (dayCounter <= howMany) {
                dayCounter = addWeekRow(calendar, dayCounter);
            }
        },

        addWeekRow = (calendar, dayCounter) => {
            let howMany = calendarSettings.monthLength(),
                weekRow = "",
                firstDay = calendarSettings.firstDay(),
		localDayCounter = dayCounter, 
        	getDayId = () => dateUtils.dayStamp(calendarSettings.year(), calendarSettings.month(), localDayCounter);
            for (let i = 0; i < 7 && dayCounter <= howMany; i++) {
                if ((AJS.$("#calendar-table-body tr").length >= 1) || (i >= firstDay.weekDayIdx)) { //are we within the month?
			let dayCell = cellContent(calendar, localDayCounter++),
			    dayId = getDayId(),  
			    dayCssClass = dayId.localeCompare(dateUtils.dayStamp()) == 0 ? "today" : "day";
			weekRow += `<td ID = ${dayId} class='${dayCssClass}'> ${dayCell} </td>`; 
                } else {
                    weekRow += "<td class='day'></td>";
                }
            }
            uiCalendar.calendarBody.append(`<TR class="week-row">${weekRow}</TR>`);
	    addEventRow(calendar, dayCounter, localDayCounter-1);
            return localDayCounter;
        },
	addEventRow = (calendar, dayBegin, dayEnd) =>{
            uiCalendar.calendarBody.append(`<TR class="event-row"><td colspan=7>events go here</td></TR>`);
	},

        cellContent = function(calendar, dayCounter) {
            let day = new Date(calendarSettings.year(), calendarSettings.month(), dayCounter),
                eventsOnDay = calendar.filter(ev =>
                    ev.timeSpan.includes(day)),
                eventList = "";
            eventsOnDay.forEach(x => eventList += x.eventTitle);

            return `${dayCounter} ${eventList}`;
        },

        populateDateSelectionForm = () => {
            let makeOption = (idx, value) => `<option value="${idx}">${value}</option>`,
                yearChooser = document.dateChooser.chooseYear;
            for (i = calendarSettings.beginYear; i < calendarSettings.endYear; i++) {
                yearChooser.options[yearChooser.options.length] = new Option(i, i);
            }
            appData['monthsEn'].forEach((month, idx) => AJS.$("#chooseMonth").append(makeOption(idx, month)));
            setFormValues();
        },

        assignActions = (calendar) => {
            ui.assignAction({
                triggerHandle: uiCalendar.previousMonth,
                action: x => calendarSettings.previousMonth(),
                postProcess: x => redrawUI(calendar)
            });
            ui.assignAction({
                triggerHandle: uiCalendar.nextMonth,
                action: x => calendarSettings.nextMonth(),
                postProcess: x => redrawUI(calendar)
            });
            ui.assignAction({
                triggerHandle: uiCalendar.createNewEvent,
                action: (e) => {
                    e.preventDefault();
                    AJS.dialog2("#event-dialog").show();
                }
            });
        };

    return {

        onReady: (calendar) => {
            calendarSettings.set();
            populateDateSelectionForm();
            assignActions(calendar);
            redrawUI(calendar);
        }
    };
})();


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
		let divBodyID =`eventDescription-${id}`;
		htmlStr +=  `<div id='${divBodyID}' class='aui-expander-content'>${eventDescription}</div>`;  
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
    calendarSideBarUI,
    calendarUI,
    eventsUI
};
