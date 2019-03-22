'use strict'
var eventUtils = require('./eventUtils.js').eventUtils;


var str = "Event from 2019-03-13 to 2019-03-28: fds</li>";
var values = /Event from ([\d-]+) to ([\d-]+)\:\s(.*?)<\/li>/.exec(str).slice(1,4);

console.log(values);

eventUtils.processDateRange("2019_01_02", "2019_02_01", "hello");
eventUtils.processDateRange("2019_04_02", "2019_02_01", "helloAgain");

eventUtils.consoleLogEvents();




