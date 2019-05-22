/******************************************************************************
 * ui.js
 * FranckEinstein90
 * ----------------
 *  includes modules 
 *  - eventsUI: all to do with the events view
 *  - calendarUI: all to do with the calendar event
 *
 * ***************************************************************************/


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

        setTitle = () => {

        },
        setFormValues = () => {},
        renderCalendar = () => {
            clear();
            setTitle();
            calendarSettings.weekSpan.forEach(addCalendarRow);
        }, 
        assignActions = () => {
            ui.assignAction(uiCalendar.ids.previousMonth, x => calendarSettings.previousMonth());
            ui.assignAction(uiCalendar.ids.nextMonth, x => calendarSettings.nextMonth());
            ui.assignAction(uiCalendar.ids.createNewEvent, x => alert("new event"));
        }
      return {
        onReady: (calendar) => {
            calendarSettings.set();
            assignActions();
            renderCalendar();
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
