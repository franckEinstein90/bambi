/******************************************************************************
 * ui.js 
 * FranckEinstein90
 * -------------------
 *  includes: 
 *  - eventDialogController
 *  - eventViewUI
 *  - calendarUI
 * ***************************************************************************/



/****************************************************
 * Module eventDialogController
 ***************************************************/
const eventDialogController = (function() {

    let dialogAction = undefined,
        eventBeginDateField = "#event-dialog-begin-date",
        eventEndDateField = "#event-dialog-end-date",
        dateStampToDate = function(dayStamp) {
            dateUtils.setSeparator("-");
            return dateUtils.dayStampToDate(dayStamp)
        },

        calendarBlankEvent = function(dayStamp) {
            let beginDate = dateStampToDate(dayStamp);
            return new eventUtils.Event(beginDate, beginDate, "", "");
        },

        setEventFormValues = function(ev) {
            dateUtils.setSeparator('-');
            AJS.$(eventBeginDateField).val(dateUtils.dateToDayStamp(ev.beginDate));
            AJS.$(eventEndDateField).val(dateUtils.dateToDayStamp(ev.endDate));
            if (ev.eventTitle) {
                AJS.$("#event-dialog-title").val(ev.eventTitle);
            }
            if (ev.eventDescription) {
                AJS.$("#event-dialog-description").val(ev.eventDescription);
            }
        },

        setEventDialogHeader = function(headerTitle) {
            AJS.$("#event-dialog-action").text(headerTitle);
        },

        validateFormInfo = function() {
            let fieldAsDate = function(fieldID) {
                    return dateUtils.dayStampToDate(AJS.$(fieldID).val());
                },
                beginDate = fieldAsDate(eventBeginDateField),
                endDate = fieldAsDate(eventEndDateField);
            console.log("validating");
        }

    return {

        dialogActions: {
            create: 1,
            edit: 2
        },

        getDialogAction: function() {
            return dialogAction;
        },

        showEdit: function(evID) {
            dialogAction = eventDialogController.dialogActions.edit;
            setEventDialogHeader("Modifying existing event");
            let ev = eventUtils.get(evID);
            setEventFormValues(ev);
            AJS.dialog2("#event-dialog").show();
        },

        showNew: function(dayStamp) {
            dialogAction = eventDialogController.dialogActions.create;
            setEventDialogHeader("Creating new event");
            let ev = calendarBlankEvent(dayStamp);
            setEventFormValues(ev);
            AJS.dialog2("#event-dialog").show();
        },

        publish: function(ev) {
            console.log("publishing event to page" + ev.eventTitle);
            validateFormInfo();
        }
    }
})();

const eventViewUI = (function(){
})();

const calendarSettings = (function() {
    let today = new Date(),
        month = today.getMonth(),
        year = today.getFullYear();
    

    return {
	    beginYear : function(){
		    return 2010;
	    },
	    endYear: function(){
		    return 2030;
	    },
	getMonth: month, 
        setMonth: function(y, m) {
            year = y;
            month = m;
        },
        nextMonth: function() {
            let m, y;
            if (month < 11) {
                m = month + 1;
                y = year;
            } else {
                m = 0;
                y = year + 1;
            }
            calendarSettings.setValues(y, m);
        },
        previousMonth: function() {
            let m, y;
            if (month > 0) {
                m = month - 1;
                y = year;
            } else {
                m = 11;
                y = year - 1;
            }
            calendarSettings.setValues(y, m);
        },
	yearIdx: function(){
		return year - calendarSettings.beginYear();
	},
        getYear: function() {
            return year;
        },
        firstDay: function() {
            return dateUtils.firstDayOfMonth(year, month);
        },

	dayOfWeek: function(monthDay){
	    //returns the weekday idx (0 to 6 - Sunday to Saturday)
	    //for the given date 
	    let d = new Date(year, month, monthDay);
	    return d.getDay();
	},
	firstDayOfMonth : dateUtils.firstDayOfMonth(year, month), 
	monthLength : dateUtils.monthLength(year, month), 
        setValues: function(y, m) {
            if (arguments.length == 0) {
                let today = new Date();
                calendarSettings.setValues(today.getFullYear(), today.getMonth());
                return;
            }
            month = m;
            year = y;
        }
    };
})();

const calendarUI = (function() {
    let dayIds = [], 
	calendarTableTitle,
	tag = (t, content, id) => `<${t}> ${content} </${t}>`,
        setCalendarTitle = function() {
            calendarTableTitle =
                dateUtils.monthIdxToStr(calendarSettings.getMonth) +
                " " + calendarSettings.getYear();
            AJS.$("#tableCalendar-title").html("<h1 style='color:white'>" +
                calendarTableTitle + "</h1>");
        },

        addTableCells = function(weekRow) {
            let dayID = function(dayDate) {
                return dateUtils.dayStamp(
                    calendarSettings.year,
                    calendarSettings.month,
                    dayDate)
            };
            return weekRow.map(x => tag('td', dayID(x))).join();
        },

        addTableBody = function() {
            let firstWeekday = calendarSettings.firstDay(),
                currentDay = 1,
                lastMonthDay = calendarSettings.monthLength;
	    //empty the dayIds array
	    dayIds.length = 0;
	
            while (currentDay < lastMonthDay) {
                currentDay = addWeekRow(currentDay);
            }
        },

        addWeekRow = function(currentDay) {
	    let weekRow = "", 
	        weekDayCell = (day) => {
			weekRow += `<td>${day === undefined?"--":day}</td>`;
			return day;
		}, 
            newWeekRow = dateUtils.weekDays.map((dayName, dayIdx) => {
                //has the month begun yet?
                if (calendarSettings.dayOfWeek(currentDay) > dayIdx) {
                   weekDayCell();
                } else if (currentDay > calendarSettings.monthLength) { //has the month already ended?
		   weekDayCell();
                } else { //make a regular week day cell
                    let dayID = weekDayCell(currentDay);
                    currentDay += 1; //increment current day
                    dayIds.push(dayID)
                }
            });

            return currentDay
        }

    return {
        /************************************************************
         * builds the calendar user interface on the page
         * **********************************************************/
        constructCalendarUI: function() {
            setCalendarTitle();
            addTableBody();
        }
    };
})();
