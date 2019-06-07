/******************************************************************************
 * ui.js
 * FranckEinstein90
 * ----------------
 *  includes modules 
 *  - eventsUI: all to do with the events view
 *  - calendarUI: all to do with the calendar event
 *
 * ***************************************************************************/
const calendarSettings = require('./calendarSettings.js').calendarSettings;
const dateUtils = require('./dateUtils.js').dateUtils;
const eventDialogController = require('./eventDialogController.js');
const appData = require('./appData.js').appData;

const ui = (function() {
    let uiHandle = (uiID) => AJS.$("#" + uiID), 
        cmdHistory = [],
        preProcessAction = function(){
		cmdHistory.push(1);
	};
    return {
        assignAction: (cmd) => {
            uiHandle(cmd.triggerHandle).click(function(e) {
		if(cmd.preProcess) {
			cmd.preProcess();
		}
		cmd.action(e);
		if(cmd.postProcess){
			cmd.postProcess();
		}
            })
        },

        UI: function(uiIds) {
            this.ids = uiIds;
        }
    }
})();


const calendarSideBarUI = (function() {
    let uiSideBar = new ui.UI({
            sideBarHeading: "sidebar_heading"
        }),
        today = new Date(),
        sidebarTitle = () =>
        appData["weekDays"][today.getDay()] + " " +
        today.getDate();
    return {
        onReady: function(calendar) {
            try {
                AJS.$("#sidebar-heading").text(sidebarTitle());
            } catch (e) {
                console.log("error " + e);
                throw e;
            }
        }
    }
})()

const calendarUI = (function() {

    let uiCalendar = new ui.UI({
            calendarTitle: "tableCalendar-title",
            calendarBody: "tableBody",
            previousMonth: "select-previous-month",
            nextMonth: "select-next-month",
            createNewEvent: "dialog-show-button"
        }),

        dayId = (dayCounter) => dateUtils.dayStamp(calendarSettings.year(), calendarSettings.month(), dayCounter),

	redrawUI = (calendar) => {
		renderCalendar(calendar)
		setFormValues();
	},

        renderCalendar = (calendar) => {
            clear();
            setTitle(calendar);
            populateCalendarTable(calendar);
        },

        clear = () => {
		AJS.$("#tableBody").empty();	
	},

        setTitle = (calendar) => {
		let calendarTitle = 
                        dateUtils.monthIdxToStr(calendarSettings.month()) + " " +
			calendarSettings.year();
		AJS.$("#tableCalendar-title").html("<h1>"+ calendarTitle +"</h1>");
        },
        setFormValues = () => {
            document.dateChooser.chooseMonth.selectedIndex = calendarSettings.month();
            document.dateChooser.chooseYear.selectedIndex = calendarSettings.yearIdx();
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
                calendarBody = AJS.$("#tableBody"),
                firstDay = calendarSettings.firstDay();

            for (let i = 0; i < 7 && dayCounter <= howMany; i++) {
                if ((AJS.$("#tableBody tr").length >= 1) || (i >= firstDay.weekDayIdx)) { //are we within the month?
                    weekRow += `<td ID=${dayId(dayCounter)} class='day'>${cellContent(calendar, dayCounter++)}</td>`;
                } else {
                    weekRow += "<td class='day'></td>";
                }
            }
            calendarBody.append(`<TR>${weekRow}</TR>`);
            return dayCounter;
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
		triggerHandle: uiCalendar.ids.previousMonth,
		action: x => calendarSettings.previousMonth(), 
		postProcess: x => redrawUI(calendar)
	    });
	    ui.assignAction({
		triggerHandle: uiCalendar.ids.nextMonth, 
		action: x => calendarSettings.nextMonth(),
		postProcess: x => redrawUI(calendar)
	    });
            ui.assignAction({
		triggerHandle: uiCalendar.ids.createNewEvent, 
		action : (e) => {
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

    let ui = {
            eventlistpane: "eventlist"
        },
        rendereventsframe = () => AJS.$("#eventlist"),
        rendereventpane = (calendarevent) => `<h1>${calendarevent.title}</h1>`,
        rendereventsview = (calendar) => {
            eventlist = rendereventsframe();
            calendar.forEach(x => eventlist.append(rendereventpane(x)));
        };

    return {

        onReady: (calendar) => {
            rendereventsview(calendar);
        }
    };

})();

module.exports = {
    calendarSideBarUI,
    calendarUI
};
