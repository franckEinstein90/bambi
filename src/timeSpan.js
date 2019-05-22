/******************************************************************************
 * The timeSpanUtils module defines several utilites related to time ranges. 
 * It includes:
 *
 *  - A TimeSpan object that abstracts the concept of a length of a span 
 *    between two time markers. 
 *
 *  - A Timer object
 *
 ******************************************************************************/

const timeSpanUtils = (function() {
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
        TimeSpan: function(beginDate, endDate, timeStep) {
            if (!timeSpanUtils.isValidDate(beginDate)) {
                throw timeSpanUtils.invalidDate(beginDate)
            }
            if (!timeSpanUtils.isValidDate(endDate)) {
                throw timeSpanUtils.invalidDate(endDate)
            }
            if (endDate < beginDate) {
                throw timeSpanUtils.invalidDateSpan
            }
            this.beginDate = beginDate;
            this.endDate = endDate;
            this.step = timeStep;
        },

	Day: function(argDate){
            if (!timeSpanUtils.isValidDate(argDate)) {
                throw timeSpanUtils.invalidDate(argDate);
            }
		this.date = argDate;	    
	}, 

        Timer: function(settings) {
            this.settings = settings;
            this.timer = null;
            this.fps = settings.fps || 30;
            this.interval = Math.floor(1000 / this.fps);
            this.timeInit = null;

            return this;
        },

        
        month: function(monthAsDate) {
            let thisMonth = new Date(monthAsDate.getFullYear(), monthAsDate.getMonth(), 1);
            return monthAfter(thisMonth).getTime() - thisMonth.getTime();
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

timeSpanUtils.TimeSpan.prototype = {

    setStep: function(step) {
        this.step = step;
    },

    includes: function(targetDate) {
        //returns true if the the timespan instance includes the targetDate
        let targetYear = targetDate.getFullYear();
        if (this.beginDate.getFullYear() <= targetYear && this.endDate.getFullYear() >= targetYear) {
            if (this.step === "year") {
                return true;
            }
            let targetMonth = targetDate.getMonth();
            if (this.beginDate.getMonth() <= targetMonth && this.endDate.getMonth() >= targetMonth) {
                if (this.step === "month") {
                    return true;
                }
                let targetDay = targetDate.getDate();
                if (this.beginDate.getDate() <= targetDay && this.endDate.getDate() >= targetDay) {
                    if (this.step === "day") {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

timeSpanUtils.Day.prototype = {
	get weekDayIdx() {
		return this.date.getDay();
	}
}

timeSpanUtils.Timer.prototype = {
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
    timeSpanUtils,
};
