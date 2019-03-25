"use strict";

var expect = require('chai').expect; //****************************//
// begin timeSpan namespace //
//****************************//


var timeSpan = function () {
  var daySpanMs = 1000 * 60 * 60 * 24,
      monthAfter = function monthAfter(monthAsDate) {
    expect(monthAsDate).to.be.a('date');
    return new Date(monthAsDate.getFullYear(), monthAsDate.getMonth() + 1, 1);
  };

  return {
    day: function day() {
      return daySpanMs;
    },
    month: function month(monthAsDate) {
      var thisMonth = new Date(monthAsDate.getFullYear(), monthAsDate.getMonth(), 1);
      return monthAfter(thisMonth).getTime() - thisMonth.getTime();
    }
  };
}(); //****************************//
// begin dateUtils namespace //
//****************************//


var dateUtils = function () {
  var theMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  var delimiter = "_",
      pad0 = function pad0(digit) {
    return digit.toString().padStart(2, '0');
  };

  return {
    firstDayofMonth: function firstDayofMonth(theYear, monthIdx) {
      return new Date(theYear, monthIdx, 1).getDay();
    },
    monthLength: function monthLength(theYear, theMonth, timeMeasure) {
      var thisMonth = new Date(theYear, theMonth, 1);
      return Math.ceil(timeSpan.month(thisMonth) / timeSpan.day());
    },
    monthIdxToStr: function monthIdxToStr(monthIdx) {
      return theMonths[monthIdx];
    },
    dayStamp: function dayStamp() {
      if (arguments.length == 0) {
        //if the function is called without arguments, returns today as dateStamp
        var d = new Date();
        return dateUtils.dayStamp(d.getFullYear(), d.getMonth(), d.getDate());
      }

      return [arguments[0].toString(), pad0(arguments[1] + 1), pad0(arguments[2])].join(delimiter);
    },
    dayStampToDate: function dayStampToDate(dayStamp) {
      var dateParts = dayStamp.split(delimiter);
      return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    },
    dateToDayStamp: function dateToDayStamp(someDate) {
      return dateUtils.dayStamp(someDate.getFullYear(), someDate.getMonth(), someDate.getDate());
    }
  };
}(); //end dateUtils


module.exports = {
  timeSpan: timeSpan,
  dateUtils: dateUtils
};