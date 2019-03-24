var expect = require('chai').expect;
var eventUtils = require('../app/eventUtils.js').eventUtils;

let today = new Date();
describe ('Event object', function(){
    it('is constructed using two dates and a string', function(){
        let ev = new eventUtils.Event(new Date(), new Date(), "x");
        expect(ev).to.not.be.undefined;
    });
});

describe('newEvent', function(){
	it('should throw an invalid date exception if one of the first two arguments is not a date', function(){
		let evInvalid1 = eventUtils.newEvent("dfsa", new Date(), "dsa");
		expect(evInvalid1).to.be.undefined;

		let evInvalid2 = eventUtils.newEvent(new Date(), 5, 5, 5, 5, 5, "dsa");
		expect(evInvalid2).to.be.undefined;
	});
	it('should create a new event using two dates and a string. in string format', function(){
		let ev = eventUtils.newEvent(new Date(), new Date(), "hello");
		expect(ev).to.exist;
	});
	it('should throw an invalid date exception the endDate is before the startDate', function(){

	});
});
describe('eventToString', function(){
	it('should output a string representing the body of an event', function(){
		let ev = eventUtils.newEvent(new Date(), new Date(), "new event");
		expect(eventUtils.eventToString(ev)).to.be.equal("2019_01_01 2019_01_02 new event");
	});
});
describe('processDateRange', function(){
	it('should process an event description in string format', function(){
		eventUtils.processDateRange('2018_01_01', '2018_01_02', "hello");
	});
});
describe('processEventStrArray', function(){
	it('should process a list of events in string format using a function that extracts the event variables', function(){
		var strArray = [ 
			"Event from 2019_03_13 to 2019_03_28: fds</li>"];
		var format = function(str){
			var vals = /Event from ([\d_]+) to ([\d_]+)\:\s(.*?)<\/li>/.exec(str).slice(1,4);
			return vals;
		}
		eventUtils.processEventStrArray(strArray, format);
	});
});
