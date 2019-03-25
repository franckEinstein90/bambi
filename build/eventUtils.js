"use strict";

var dateUtils = require('./dateUtils.js');

var eventUtils = function () {
  //****************************//
  // begin eventUtils namespace //
  //****************************//
  var events = [];

  function consoleLogEvent(ev) {
    console.log(dateUtils.dateToDayStamp(ev.beginDate) + " " + dateUtils.dateToDayStamp(ev.endDate) + " " + ev.eventTitle);
  }

  ;

  function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
  }

  ;
  return {
    Event: function Event(bdate, edate, title) {
      this.beginDate = bdate;
      this.endDate = edate;
      this.title = title;
    },
    newEvent: function newEvent(begDate, endDate, title) {
      if (isValidDate(begDate) && isValidDate(endDate)) {
        return new eventUtils.Event(begDate, endDate, title);
      }

      throw 'err';
    },
    eventToString: function eventToString(ev) {
      return dateUtils.dateToDayStamp(ev['beginDate']) + " " + dateUtils.dateToDayStamp(ev['endDate']) + " " + ev['eventTitle'];
    },
    processDateRange: function processDateRange(begDateStamp, endDateStamp, strShortTitle) {
      //To Do: Data Validation here
      var event = eventUtils.newEvent(dateUtils.dayStampToDate(begDateStamp), dateUtils.dayStampToDate(endDateStamp), strShortTitle);
      events.push(event);
      events.sort(function (a, b) {
        if (a.beginDate < b.beginDate) {
          return -1;
        }

        if (a.beginDate > b.beginDate) {
          return 1;
        }

        return 0;
      });
    },
    processEventStrArray: function processEventStrArray(eventStrArray, format) {
      //evenStrArray is an an array of string containing event information
      //format is a regular expression that defines the format of the string
      var getValues = function getValues(str) {
        var values = format(str);
        eventUtils.processDateRange(values[0], values[1], values[2]);
      };

      eventStrArray.forEach(function (str) {
        return getValues(str);
      });
    },
    consoleLogEvents: function consoleLogEvents() {
      events.forEach(consoleLogEvent);
    } //****************************//
    // end eventUtils namespace //
    //****************************//

  };
}();

module.exports = {
  eventUtils: eventUtils
};