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
        setMonth: function(y, m) {
            year = y;
            month = m;
        },
        nextMonth: function() {
            let m, y;
            if (this.month < 11) {
                m = this.month + 1;
                y = this.year;
            } else {
                m = 0;
                y = this.year + 1;
            }
            calendarSettings.setValues(y, m);
        },
        previousMonth: function() {
            let m, y;
            if (this.month > 0) {
                m = this.month - 1;
                y = this.year;
            } else {
                m = 11;
                y = this.year - 1;
            }
            calendarSettings.setValues(y, m);
        },
	yearIdx: function(){
		return this.year - calendarSettings.beginYear();
	},
        getYear: function() {
            return year;
        },
        firstDay: function() {
            return dateUtils.firstDayOfMonth(year, month);
        },
        setValues: function(year, month) {
            if (arguments.length == 0) {
                let today = new Date();
                calendarSettings.setValues(today.getFullYear(), today.getMonth());
                return;
            }
            this.month = month;
            this.year = year;
            this.firstDayOfMonth = dateUtils.firstDayOfMonth(this.year, this.month);
            this.monthLength = dateUtils.monthLength(this.year, this.month);
        }
    };
})();

const calendarUI = (function() {
    let calendarTableTitle,
        tag = (t, content, id) => `<${t}> ${content} </${t}>`,
        setCalendarTitle = function() {
            calendarTableTitle =
                dateUtils.monthIdxToStr(calendarSettings.month) +
                " " + calendarSettings.year
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
                lastMonthDay = calendarSettings.monthLength,
                dayIds = [];
            while (currentDay <= lastMonthDay) {
                currentDay = addWeekRow(currentDay);
            }
        },

        addWeekRow = function(currentDay) {
	    let weekDayCell = (day) => {
		}, 
            newWeekRow = dateUtils.weekDays.map((dayName, dayIdx) => {
                //has the month begun yet?
                if (currentDay.weekDayIdx > dayIdx) {
                   weekDayCell();
                } else if (currentDay > calendarSettings.monthLength) { //has the month already ended?
		   weekDayCell();
                } else { //make a regular week day cell
                    let dayID = weekDayCell(currentDay);
                    currentDay += 1; //increment current day
                    dayIds.push[dayID]
                }
            });

            return currentDay
        }

    return {
        /************************************************************
         * builds the calendar user interface on the page
         * **********************************************************/
        constructCalendarUI: function() {
            let dayCounter = 1;
            let weekday1st = calendarSettings.firstDayOfMonth;
            setCalendarTitle();
            addTableBody();
        }
    };
})();
