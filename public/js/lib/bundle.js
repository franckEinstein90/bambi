(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const appData = {
	"monthsEn" :  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
}


module.exports = { appData };

},{}],2:[function(require,module,exports){

/******************************************************************************
 * calendarEvents namespace 
 * FranckEinstein
 * ------------------------
 * 
 *  A library to manage calendar events. Defines objects: 
 *   - calendarEvents.Event
 *   - calendarEvents.EventSequence
 *
 ******************************************************************************/
const timeSpan = require('./timeSpan').timeSpan;
const dateUtils = require('./dateUtils').dateUtils;
const events = require('./events').events;


const calendarEvents = (function() {

    logEvent = function(ev) {
            console.log(
                dateUtils.dateToDayStamp(ev.beginDate) + " " +
                dateUtils.dateToDayStamp(ev.endDate) + " " + ev.eventTitle + " " + ev.eventDescription);
        },
        /******************************************************************
         * calendar is the event registrar for calendarEvents
         ******************************************************************/
        calendar = new events.Registrar();

    return {
        
        /******************************************************************
         *  A calendar event is a type of event that has the following
         *  properties:
         *
         *  - A begin date (beginDate)
         *  - An end date  (endDate)
         *  - A title (at most 255 chars)
         *  - A description (at most 510 chars)
         ***********************************************************************/


   CalendarEvent: function(beginDate, endDate, title, description) {
            let assignIfDefined = x => x !== undefined? x.trim():"";

            try {
                  this.timeSpan = new timeSpan.Span(
                                     beginDate, endDate, 
                                     timeSpan.units.days);

                  this.eventTitle = assignIfDefined(title);
                  this.eventDescription = assignIfDefined(description);

                events.Event.call(
                    this, 
                    events.eventState[this.timeSpan.includes(new Date())?"on":"off"]);
            } 
            catch (e) {
                throw (e);
            }
        },

       /*********************************************************************/
        /* Errors, exceptions, and logs
        /*********************************************************************/
        Exception: function(err) {
            this.message = err;
        }
   }
    //****************************//
    // end calendarEvents namespace //
    //****************************//
})();

/*****************************************************************************/
/* Inheritance for calendarEvents.CalendarEvent from eventRegistrar.Event 
/*****************************************************************************/
calendarEvents.CalendarEvent.prototype = Object.create(events.Event.prototype);
calendarEvents.CalendarEvent.constructor = events.Event;



module.exports = { calendarEvents };

},{"./dateUtils":4,"./events":5,"./timeSpan":8}],3:[function(require,module,exports){
/**************************************************************
 *  calendarSettings module 
 *  abstracts the data element of the calendar 
 **************************************************************/

const dateUtils = require('./dateUtils.js').dateUtils;

const calendarSettings = (function() {
    let _month, _year;

    return {
	year: () => _year, 
        month: () => _month, 
        firstDay: () => dateUtils.firstDayOfMonth(_year, _month), 
        monthLength: () => dateUtils.monthLength(_year, _month), 
	beginYear : 2010, 
	endYear: 2030, 
        
       	nextMonth: function() { //set calendarSettings to following month
            let m, y;
            if (_month < 11) {
                m = _month + 1;
                y = _year;
            } else {
                m = 0;
                y = _year + 1;
            }
            calendarSettings.set(y, m);
        },
        previousMonth: function() { //set calendarSettings to previous month
            let m, y;
            if (_month > 0) {
                m = _month - 1;
                y = _year;
            } else {
                m = 11;
                y = _year - 1;
            }
            calendarSettings.set(y, m);
        },
	yearIdx: function(){
		return _year - calendarSettings.beginYear;
	}, 
        set: function(year, month) {
            if (arguments.length == 0) {
                let today = new Date();
                calendarSettings.set(today.getFullYear(), today.getMonth());
                return;
            }
            _month = month;
            _year = year;       
        }
    };
})();

//end calendarSettings
module.exports = {calendarSettings};

},{"./dateUtils.js":4}],4:[function(require,module,exports){
/******************************************************************************
 * The dateUtils module defines several utilites related to time 
 * It includes:
 *
 ******************************************************************************/

const timeSpan = require('./timeSpan').timeSpan;

const dateUtils = (function() {

    let theMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },

        separator = "_", //used as separator for time stamps

        pad0 = (digit) => digit.toString().padStart(2, '0'); //pads with 0 up to 2 chars

    return {

        setSeparator: (sep) => separator = sep,

        firstDayOfMonth: (theYear, monthIdx) => 
            new timeSpan.Day(new Date(theYear, monthIdx, 1)),

        monthLength: (year, monthIdx, timeMeasure) =>
            Math.ceil(
                timeSpan.msSpanLength.month(year, monthIdx) / 
                timeSpan.msSpanLength.day),

        monthIdxToStr: (monthIdx) => theMonths[monthIdx],

        dayStamp: function(){
            if (arguments.length == 0) { //if the function is called without arguments, returns today as dateStamp
                let d = new Date();
                return dateUtils.dayStamp(d.getFullYear(), d.getMonth(), d.getDate());
            }
            return arguments[0].toString() + separator +
                (arguments[1] + 1).toString().padStart(2, '0') + separator +
                (arguments[2]).toString().padStart(2, '0');
        },

        dayStampToDate: (dayStamp) => {
            let dateParts = dayStamp.split(separator);
            return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        },

        dateToDayStamp: (someDate) => {
            return dateUtils.dayStamp(someDate.getFullYear(), someDate.getMonth(), someDate.getDate());
        }
    }
})();

module.exports = {
    dateUtils
};

},{"./timeSpan":8}],5:[function(require,module,exports){
/*******************************************************************
 * events Module
 * ---------------
 *  events.Event: Include implementations for:
 *
 *  - object events.Event, base class for all other event object in system
 *    . has status on or off
 *    . can be flipped from one to the other
 *    . has a unique id
 *  
 *  - object events.Chain, implements concept of a chain of events
 *    . sets of events that are linked to one another
 *
 *  - object events.Registrar, a container for objects of type events.Event
 *
 *  ------------
 *  Unit tests: /test/events.js
 *  Dependent modules: /src/calendarEvents.js
 * 
 * *****************************************************************/

const events = (function() {


    let eventRegistrar = new Map(),

        generateUUID = () => {
            let d = new Date().getTime();
            if (    typeof performance !== 'undefined' && 
                    typeof performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        };

    return {

        eventState: {
            on: 1,
            off: 0
        },

        /*************************************************************
         * events.Event
         * FranckEinstein90
         * -------------------
         *
         *  base event abstraction. A wrapper for:  
         *   - a unique id
         *   - a status of on or off
         *
         * **********************************************************/
        Event: function(state) { // events.Event registered at construction
            this.id = generateUUID();

            this.onOffActions = [];
            this.onOnActions = [];
            this.onFlipActions = [];

            if (state === undefined) {
                this.state = events.eventState.on;
            } else {
                this.state = state;
            }


            eventRegistrar.set(this.id, this.state);
        },

        /*************************************************************
         * events.Chain
         * -------------------
         *  Structure that links events to each other
         *  provides facilities to create webs of related 
         *  events
         * **********************************************************/
        Chain: function() {
            //todo
        },

        /*************************************************************
         * events.Registrar
         * -------------------
         *  Structure into which events can be registered. Provides
         *  various operations on the set of registered events, map, 
         *  filter, reduce
         * **********************************************************/

        Registrar: function() { // Event registrar
            this.events = new Map();
        },

        /*************************************************************
         * events.Exception
         * -------------------
         *  Error Structure 
         * **********************************************************/
        Exception: function(err) {

        }
    };
})();


/******************************************************************************
 * Event class prototype
 * 
 * ***************************************************************************/

events.Event.prototype = {

    get isOn() {
        return (this.state == events.eventState.on);
    },

    get isOff() {
        return (this.state === events.eventState.off);
    },

    on: function() { //event is ongoing
        if (this.isOff) {
            this.state = events.eventState.on;
            this.onOnActions.forEach(x => x());
        }
    },

    off: function() { //event is offgoing
        if (this.isOn) {
            this.state = events.eventState.off;
            this.onOffActions.forEach(x => x());
        }
    },


    flip: function() {
        if (this.isOn) {
            this.off();
        } else {
            this.on;
        }
        this.onFlipActions.forEach(x => x());
    }
};

/******************************************************************************
 * Registrar objects
 * -----------------
 *  data structure that holds and registers events, 
 *  keeping track of their status
 * 
 * ***************************************************************************/
events.Registrar.prototype = {

    /*****************************************************************
     *  Registers an event in the registrar
     *  *************************************************************/

    get size() {
        return this.events.size;
    },

    register: function(ev) {
        this.events.set(ev.id, ev);
    },

    flush: function(ev) {
        this.events.clear();
    },

    forEach: function(eventCallbackFunction) {
        this.events.forEach(eventCallbackFunction);
    },

    get: function(eventId) {
        return this.events.get(eventId);
    },

    filter: function(filterPred) {
        /********************************************************
         * returns an array of events filtered as 
         * per the predicate argument
         * *****************************************************/
        let arrayRes = [];
        this.events.forEach((value, key) => {
            if (filterPred(value)) {
                arrayRes.push(value);
            }
        });
        return arrayRes;
    },

    remove: function(evId) {
        /********************************************************
         * removes an event with given id from 
         * the registrar
         * *****************************************************/
        if (!this.events.has(evId)) {
            throw new events.Exception("Event does not exist");
        }
        this.events.delete(evId);
    }


};

module.exports = {
    events
};

},{}],6:[function(require,module,exports){
/*****************************************************************************/
const pageContainer = require('./pageContainer.js').pageContainer;
/*****************************************************************************/

AJS.toInit(function($) {

    /*********************************************************************
     * Collects everything that looks like an event description 
     * already on the page into an array of strings
     ********************************************************************/
    let eventDescriptions= [];
    AJS.$("h1:contains('Events') + ul li").each(function(index) {
        eventDescriptions.push($(this).text());
    });

    /*********************************************************************
     * inits and sets-up the varous ui elements
     * using array of event description as input
     ********************************************************************/
    pageContainer.onReady(eventDescriptions);

});

},{"./pageContainer.js":7}],7:[function(require,module,exports){
const events = require('./events.js').events;
const calendarEvents = require('./calendarEvents.js').calendarEvents;
const calendarUI = require('./ui.js').calendarUI;

const p = (function() {
    return {
        tag: (t, content, id) => `<${t}> ${content} </${t}>`,
        makeDiv: (divBody, divId, divClass) => `<div class='${divClass}' id='${divId}'>${divBody}</div>`,
        makeSpan: (spanBody, spanId, spanClass) => `<span class='${spanClass}' id = '${spanId}'>${spanBody}</span>`,
        uiHandle: (uiID) => AJS.$("#" + uiID),
        toDate: (dayStamp) => {
            let [year, month, day] = dayStamp.split("-");
            return new Date(year, month - 1, day);
        }
    }
})()

const eventDecoder = (function() {
    let eventDescriptionMatcher = /Event from (\d{4}\-\d{2}\-\d{2}) to (\d{4}\-\d{2}\-\d{2})\:\s(.+)/,
        parse = (evStr) => {
            let recognized = evStr.match(eventDescriptionMatcher);
            if (recognized) {
                let [, beginDate, endDate, description] = recognized;
                return {
                    beginDate,
                    endDate,
                    description
                }
            }
        },

        makeEventObject = (evFieldValues) => {
            let beginDate = p.toDate(evFieldValues.beginDate),
            endDate = p.toDate(evFieldValues.endDate),
            description = evFieldValues.description.split(':').filter(x => x.length > 1);

            try {
                return new calendarEvents.CalendarEvent(
                    beginDate,
                    endDate,
                    description[0],
                    description[1]);
            } catch (e) {
                throw e + " at eventDecoder.makeEventObject";
            }
        }

    return {
        /********************************************************************
         * given a string describing a calendar event, verify it for format
         *  and content, and if an event can be made of it, create it, id it,
         *  and  register it with eventUtils manager
         ********************************************************************/
        processEventDescription: (calendar, eventDescriptionString) => {
            let eventDescriptionFields = parse(eventDescriptionString);
            if (eventDescriptionFields) {
                newEvent = makeEventObject(eventDescriptionFields);
                calendar.register(newEvent);
            }
        }
    }
})()

const pageContainer = (function(){

 let calendar = new events.Registrar();

                    return {
                        onReady: (eventStrings) => {
                            eventStrings.forEach(str => eventDecoder.processEventDescription(calendar, str));
                            calendarUI.onReady(calendar);
                        }
                    }
})()

module.exports = { pageContainer }

},{"./calendarEvents.js":2,"./events.js":5,"./ui.js":9}],8:[function(require,module,exports){
/******************************************************************************
 * The timeSpan module defines several utilites related to time ranges. 
 * It includes:
 *
 *  - A TimeSpan object that abstracts the concept of a length of a span 
 *    between two time markers. 
 *  - A day object that abstracts the concept of a day (date, weekday, holydays)
 *  - A timer 
 ******************************************************************************/

const timeSpan = (function() {
    const secondSpanMs = 1000,
        daySpanMs = secondSpanMs * 60 * 60 * 24,
        monthAfter = function(monthAsDate) {
            return new Date(monthAsDate.getFullYear(),
                monthAsDate.getMonth() + 1, 1);
        };

    return {
        isValidDate: function(date) {
            return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
        },

        units: {
            seconds: 5,
            minutes: 10,
            hours: 15,
            days: 20,
            months: 25,
            years: 30,
            decades: 35,
            centuries: 40
        },
        msSpanLength: { // lengths of time in ms
            day: secondSpanMs * 60 * 60 * 24,
            month: function(year, monthIdx) {
                let day1 = new Date(year, monthIdx, 1);
                return monthAfter(day1).getTime() - day1.getTime();
            }
        },
        /**************************************************
         * Includes definition for the following objects: 
         * - TimeSpan
         * - Timer
         *************************************************/
        Span: function(beginDate, endDate, units) {
            if (!timeSpan.isValidDate(beginDate)) {
                throw timeSpan.invalidDate(beginDate)
            }
            if (!timeSpan.isValidDate(endDate)) {
                throw timeSpan.invalidDate(endDate)
            }
            if (endDate < beginDate) {
                throw timeSpan.invalidDateSpan
            }
            this.beginDate = beginDate;
            this.endDate = endDate;
            this.units = (units === undefined) ? timeSpan.units.days : units;
        },
        Timer: function(settings) {
            this.settings = settings;
            this.timer = null;
            this.fps = settings.fps || 30;
            this.interval = Math.floor(1000 / this.fps);
            this.timeInit = null;

            return this;
        },

        Day: function(date) {
            if (!timeSpan.isValidDate(date)) {
                throw timeSpan.invalidDate(argDate);
            }
            this.date = date;
        },

        /*****************************************************
         * Errors and exceptions
         ****************************************************/
        invalidDate: function(aDate) {
            throw `${aDate} is not a valid date`
        },
        invalidDateSpan: "Invalid Date Span"
    };
})();

timeSpan.Span.prototype = {

    setUnits: function(units) {
        this.units = units;
    },

    includes: function(targetDate) {
        targetYear = targetDate.getFullYear();
        if (this.beginDate.getFullYear() <= targetYear &&
            this.endDate.getFullYear() >= targetYear) {
            if (this.units === timeSpan.units.years) {
                return true;
            }
            let targetMonth = targetDate.getMonth();
            if (this.beginDate.getMonth() <= targetMonth &&
                this.endDate.getMonth() >= targetMonth) {
                if (this.units === timeSpan.units.months) {
                    return true;
                }
                let targetDay = targetDate.getDate();
                if (this.beginDate.getDate() <= targetDay &&
                    this.endDate.getDate() >= targetDay) {
                    if (this.units === timeSpan.units.days) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

timeSpan.Day.prototype = {
    get weekDayIdx() {
        return this.date.getDay();
    }
}

timeSpan.Timer.prototype = {
    run: function() {
        let $this = this;
        this.settings.run();
        this.timeInit += this.interval;
        this.timer = setTimeout(
            function() {
                $this.run()
            },
            this.timeInit - (new Date).getTime()
        );
    },
    start: function() {
        if (this.timer == null) {
            this.timeInit = (new Date).getTime();
            this.run();
        }
    },
    stop: function() {
        clearTimeout(this.timer);
        this.timer = null;
    }
}




module.exports = {
    timeSpan
};

},{}],9:[function(require,module,exports){
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
const appData = require('./appData.js').appData;

const ui = (function() {

    let uiHandle = (uiID) => AJS.$("#" + uiID);

    return {
        assignAction: (cmd, action) => {
            uiHandle(cmd).click(function(e) {
                action();
            })
        },
        UI: function(uiIds) {
            this.ids = uiIds;
        }
    }
})();



const calendarUI = (function() {

    let uiCalendar = new ui.UI({
            calendarTitle: "tableCalendar-title",
            calendarBody: "tableBody",
            previousMonth: "select-previous-month",
            nextMonth: "select-next-month",
            createNewEvent: "dialog-show-button"
        }),

	dayId = (dayCounter) => dateUtils.dayStamp(calendarSettings.year(), calendarSettings.month(), dayCounter) ,

        renderCalendar = (calendar) => {
            clear();
            setTitle(calendar);
            populateCalendarTable(calendar);
        },

        clear = () => { },

        setTitle = (calendar) => {
/*            getUIHandle(uiElementsIds.CalendarTitle).html("<h1>" +
                dateUtils.monthIdxToStr(calendarSettings.month()) + " " +
                calendarSettings.year() + "</h1>");*/
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
		    weekRow = "" ,
       		    calendarBody = AJS.$("#tableBody"), 
		    firstDay = calendarSettings.firstDay();

		for(let i=0; i<7 && dayCounter <= howMany; i++){
			if ((AJS.$("#tableBody tr").length >= 1) || (i >= firstDay.weekDayIdx)){ //are we within the month?
				weekRow += `<td ID=${dayId(dayCounter)} class='day'>${cellContent(calendar, dayCounter++)}</td>`;
			}
			else{
				weekRow += "<td class='day'></td>";
			}
		}
		calendarBody.append(`<TR>${weekRow}</TR>`);
            	return dayCounter;
        },

	cellContent = function(calendar, dayCounter) {
		let day = new Date(calendarSettings.year(), calendarSettings.month(), dayCounter), 
		    eventsOnDay = calendar.filter(ev.timeSpan.includes(day)), 
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

        assignActions = () => {
            ui.assignAction(uiCalendar.ids.previousMonth, x => calendarSettings.previousMonth());
            ui.assignAction(uiCalendar.ids.nextMonth, x => calendarSettings.nextMonth());
            ui.assignAction(uiCalendar.ids.createNewEvent, x => alert("new event"));
        };

    return {

        onReady: (calendar) => {
            calendarSettings.set();
            populateDateSelectionForm();
            assignActions();
            renderCalendar(calendar);
            setFormValues();
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
    calendarUI
};

},{"./appData.js":1,"./calendarSettings.js":3,"./dateUtils.js":4}]},{},[6]);
