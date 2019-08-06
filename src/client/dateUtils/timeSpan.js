/******************************************************************************
 * The timeSpan module defines several utilites related to time ranges. 
 * It includes:
 *
 *  - A TimeSpan object that abstracts the concept of a length of a span 
 *    between two time markers. 
 *  - A day object that abstracts the concept of a day (date, weekday, holydays)
 *  - A timer
 * 
 *  Last Update 2019/08/06 - FranckEinstein90 
 ******************************************************************************/
"use strict";
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
            try {
                this.beginDate = moment(beginDate);
                this.endDate = moment(endDate);
                if (this.endDate.isBefore(this.beginDate)) {
                    throw timeSpan.invalidDateSpan
                }
                this.units = (units === undefined) ? timeSpan.units.days : units;
            } catch (e) {
                if (e === timeSpan.invalidDateSpan) {
                    throw e;
                }
                throw ("Unknown error " + e + "at timeSpan.Span Constructor")
            }
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
        let targetDate;

        targetDate = moment(tD);

        /*************************************************************
         *  input validation
         * ***********************************************************/
        //Only implemented for {timeSpan.units.years, timeSpan.units.months, timeSpan.units.days}
        assert.includeMembers([timeSpan.units.years, timeSpan.units.months, timeSpan.units.days], [this.units], "unsuported time unit");

        if (targetDate.isSameOrBefore(this.endDate, 'year') && targetDate.isSameOrAfter(this.beginDate, 'year')) {
            if (this.units === timeSpan.units.years) {
                return true;
            }
            if (targetDate.isSameOrBefore(this.endDate, 'month') && targetDate.isSameOrAfter(this.beginDate, 'month')) {
                if (this.units === timeSpan.units.months) {
                    return true;
                }
                if (targetDate.isSameOrBefore(this.endDate, 'day') && targetDate.isSameOrAfter(this.beginDate, 'day')) {
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