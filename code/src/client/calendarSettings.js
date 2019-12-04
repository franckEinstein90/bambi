"use strict"; 
/**************************************************************
 *  calendarSettings module 
 *  keeps tracks of the current settings of the calendar
 *  - currentSelectedDate
 *  - mode: {year, month, day}
 **************************************************************/

const timeSpan = require('../time/timeSpan.js').timeSpan;
const dateUtils = require('../time/dateUtils.js').dateUtils;

const calendarSettings = (function() {
    let today, selectedDate, _mode, 
        categories

    categories = new Map() 
    today = new Date()
    selectedDate = { //by default, selected date is set to today
            _year: today.getFullYear(),
            _month: today.getMonth(),
            _day: today.getDate()
        },
    _mode = timeSpan.units.months

    return {
        mode: {
            day: timeSpan.units.days,
            week: timeSpan.units.weeks,
            month: timeSpan.units.months,
            year: timeSpan.units.years
        },

        categories: {
            show: 1, 
            hide:2
        }, 

        selectedYear: () => selectedDate["_year"],
        selectedMonth: () => selectedDate["_month"],
        selectedDay: () => selectedDate["_day"],
        selectedMode: () => _mode,
        current: function() {
            //returns true if the selected date is today's
            return (calendarSettings.selectedYear() === today.getFullYear()) &&
                (calendarSettings.selectedMonth() === today.getMonth()) &&
                (calendarSettings.selectedDay() === today.getDate());
        },
        firstDay: function() {
            return dateUtils.firstDayOfMonth(
                calendarSettings.selectedYear(),
                calendarSettings.selectedMonth());
        },
        monthLength: () => dateUtils.monthLength(
            calendarSettings.selectedYear(),
            calendarSettings.selectedMonth()),
        beginYear: 2010,
        endYear: 2030,

        nextMonth: function() { //set calendarSettings to following month
            let newSelectedDate = {
                day: 1
            };
            if (calendarSettings.selectedMonth() < 11) {
                newSelectedDate.month = calendarSettings.selectedMonth() + 1;
                newSelectedDate.year = calendarSettings.selectedYear();
            } else {
                newSelectedDate.month = 0;
                newSelectedDate.year = calendarSettings.selectedYear() + 1;
            }
            newSelectedDate.day = 1;
            calendarSettings.set(newSelectedDate);
        },

        previousMonth: function() { //set calendarSettings to previous month
            let newSelectedDate = {
                day: 1
            };
            if (calendarSettings.selectedMonth() > 0) {
                newSelectedDate.month = calendarSettings.selectedMonth() - 1;
                newSelectedDate.year = calendarSettings.selectedYear();
            } else {
                newSelectedDate.month = 11;
                newSelectedDate.year = calendarSettings.selectedYear() - 1;
            }
            calendarSettings.set(newSelectedDate);
        },

        yearIdx: function() {
            return calendarSettings.selectedYear() - calendarSettings.beginYear;
        },

        reset: function() { //reset to today's date
            calendarSettings.set({
                year: today.getFullYear(),
                month: today.getMonth(),
                day: today.getDate()
            })
        },

        set: function({ year, month, day }) {
            selectedDate._year = year;
            selectedDate._month = month;
            selectedDate._day = day;
        },

        showCategories: function(){
            return categories //filters events displayed on calendar
        }
    };
})();

//end calendarSettings
module.exports = {
    calendarSettings
};