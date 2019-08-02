/******************************************************************************
 * The timeSpan module defines several utilites related to time ranges. 
 * It includes:
 *
 *  - A TimeSpan object that abstracts the concept of a length of a span 
 *    between two time markers. 
 *  - A day object that abstracts the concept of a day (date, weekday, holydays)
 *  - A timer 
 ******************************************************************************/
"use strict"
const assert = require('chai').assert;
const moment = require('moment');

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

        Timer: function(settings) { //untested
            this.settings = settings;
            this.timer = null;
            this.fps = settings.fps || 30;
            this.interval = Math.floor(1000 / this.fps);
            this.timeInit = null;
        },

        Day: function(date) { //no unit tests
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

    includes: function(tD) { //returns true if the span includes this date or part of this date
        let targetDate,
            inOrder;

        targetDate = moment(tD);
        inOrder = (x1, x2, x3) => (x1 <= x2 && x2 <= x3) ? true : false;

        /*************************************************************
         *  input validation
         * ***********************************************************/
        //Only implemented for {timeSpan.units.years, timeSpan.units.months, timeSpan.units.days}
        assert.includeMembers([timeSpan.units.years, timeSpan.units.months, timeSpan.units.days], [this.units], "unsuported time unit");

        //Check the year
        if (!inOrder(this.beginDate.getFullYear(), targetDate.year(), this.endDate.getFullYear())) {
            return false; //different years
        }
        if (this.units === timeSpan.units.years) {
            return true;
        }
        if (!inOrder(this.beginDate.getMonth(), targetDate.month(), this.endDate.getMonth())) {
            return false; //month not in range
        }
        if (this.units === timeSpan.units.months) {
            return true;
        }
        if (!inOrder(this.beginDate.getDate(), targetDate.date(), this.endDate.getDate())) {
            return true;
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