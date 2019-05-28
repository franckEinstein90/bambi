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
const appData = require('./appData.js').appData;
 
const ui = (function() {

    let uiHandle = (uiID) => AJS.$("#" + uiID);

    return {
        assignAction: (cmd, action) => {
            uiHandle(cmd).click(function(e) {
                action();
            })
        }, 
        UI: function(uiIds){
            this.ids = uiIds; 
        }
    }
})();



const calendarUI = (function() {

    let uiCalendar = new ui.UI  ({
            calendarTitle: "tableCalendar-title",
            calendarBody: "tableBody",
            previousMonth: "select-previous-month",
            nextMonth: "select-next-month",
            createNewEvent: "dialog-show-button"
        }),

        addCalendarRow = (week) => {

        },

        clear = () => {

        },

        setTitle = (calendar) => {
		getUIHandle(uiElementsIds.CalendarTitle).html("<h1>" +
                dateUtils.monthIdxToStr(calendarSettings.month()) + " " +
                calendarSettings.year() + "</h1>");
        },
        setFormValues = () => {
		document.dateChooser.chooseMonth.selectedIndex = calendarSettings.month();
		document.dateChooser.chooseYear.selectedIndex = calendarSettings.yearIdx();
	},
        renderCalendar = (calendar) => {
            clear();
            setTitle(calendar);
            calendarSettings.weekSpan.forEach(addCalendarRow);
        }, 

	populateDateSelectionForm = () => {
	  let makeOption = (idx, value) => `<option value="${idx}">${value}</option>`, 
          yearChooser = document.dateChooser.chooseYear;
          for (i = calendarSettings.beginYear; i < calendarSettings.endYear; i++) {
             yearChooser.options[yearChooser.options.length] = new Option(i, i)
          }
          appData['monthsEn'].forEach((month, idx) => AJS.$("#chooseMonth").append(makeOption(idx, month)));
          setFormValues();
        }, 

        assignActions = () => {
            ui.assignAction(uiCalendar.ids.previousMonth, x => calendarSettings.previousMonth());
            ui.assignAction(uiCalendar.ids.nextMonth, x => calendarSettings.nextMonth());
            ui.assignAction(uiCalendar.ids.createNewEvent, x => alert("new event"));
        }
      return {
        onReady: (calendar) => {
            calendarSettings.set();
	    populateDateSelectionForm();
            assignActions();
            renderCalendar(calendar);
	    setFormValues();
        }
    }
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
        }

    return {

        onReady: (calendar) => {
            rendereventsview(calendar);
        }
    }

})();

module.exports = { calendarUI }
