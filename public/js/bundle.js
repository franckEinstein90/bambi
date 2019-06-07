(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./timeSpan":3}],2:[function(require,module,exports){
/*****************************************************************************/
const timeSpan = require('./timeSpan').timeSpan;
const dateUtils= require('./dateUtils').dateUtils;
/*****************************************************************************/

            let April24_2010 = new Date(2010, 03, 24), 
                April27_2010 = new Date(2010, 03, 27),
                ts = new timeSpan.Span(April24_2010, April27_2010, "day");

console.log(ts.beginDate);
console.log(dateUtils.monthIdxToStr(1));

/*AJS.toInit(function($) {

    /*********************************************************************
     * Collects everything that looks like an event description 
     * already on the page into an array of strings
     ********************************************************************/
 /*   let eventDescriptions= [];
    AJS.$("h1:contains('Events') + ul li").each(function(index) {
        eventDescriptions.push($(this).text());
    });

    /*********************************************************************
     * inits and sets-up the varous ui elements
     * using array of event description as input
     ********************************************************************/
  /*  pageContainer.onReady(eventDescriptions);

});*/

},{"./dateUtils":1,"./timeSpan":3}],3:[function(require,module,exports){
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

},{}]},{},[2]);
