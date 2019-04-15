var expect = require('chai').expect;
var eventUtils = require('../src/eventUtils.js').eventUtils;
var validator = require('validator');

let today = new Date();

describe('newEvent', function(){
	it('should throw an invalid date exception if one of the first two arguments is not a date', function(){
		expect(eventUtils.newEvent.bind("dfsa", new Date(), "dsa")).to.throw("unexpected argument");
	});

	it('should create a new event using two dates and a string. in string format', function(){
		let ev = eventUtils.newEvent(new Date(), new Date(), "hello");
		expect(ev).to.exist;
	});
	it('should create a new event using two dates and two strings in string format', function(){
		let ev = eventUtils.newEvent(new Date(), new Date(), "Xmas", "Santa's coming");
		expect(ev).to.exist;
	});
	it('should throw an invalid date exception the endDate is before the startDate', function(){
	});
});

describe ('Event object', function(){
    it('is constructed using two dates and a string', function(){
        let ev = new eventUtils.Event(new Date(), new Date(), "x");
        expect(ev).to.not.be.undefined;
    });
    it('assigns a unique RFC4122 ID to each event', function(){
        let ev = new eventUtils.Event(new Date(), new Date(), "x");
        expect(validator.isUUID(ev.id)).to.equal(true);
    });
});

describe('eventToString', function(){
	it('should output a string representing the body of an event', function(){
		let ev = new eventUtils.Event(new Date("2019/01/01"), new Date("2019/01/02"), "new event");
		expect(eventUtils.eventToString(ev)).to.be.equal("2019_01_01 2019_01_02 new event");
	});
	it('should output a string representing the body of an event', function(){
		let ev = new eventUtils.Event(new Date("2019/01/01"), new Date("2019/01/02"), "new event", "do something");
		expect(eventUtils.eventToString(ev)).to.be.equal("2019_01_01 2019_01_02 new event [do something]");
	});
});
describe('processDateRange', function(){
	it('should process an event description with parameters passed in string format', function(){
		eventUtils.processDateRange('2018_01_01', '2018_01_02', "hello");
		expect(eventUtils.length()).to.be.equal(1);
		eventUtils.flush();
	});
	it('should return the unique ID of the new event', function(){
		let newEventID = eventUtils.processDateRange('2018_01_01', '2018_01_02', "hello");
        expect(validator.isUUID(newEventID)).to.equal(true);
eventUtils.flush();

	});

});
describe('removeEvent(evId)', function(){
	it('should remove the event with the given ID from the eventStore', function(){
	let newEventID = eventUtils.processDateRange('2018_01_01', '2018_01_02', "hello");
		console.log(newEventID);
		expect(eventUtils.length()).to.be.equal(1);
		eventUtils.removeEvent(newEventID);
		expect(eventUtils.length()).to.be.equal(0);
		eventUtils.flush();
	});
});
describe('eventsToStringArray', function(){
	it('should output an array of string representing the list of events in the internal event list', function(){
		eventUtils.processDateRange('2018_01_01', '2018_01_02', "hello");
		expect(eventUtils.eventsToStringArray()).to.be.eql(["2018_01_01 2018_01_02 hello"]);
		eventUtils.flush();
	});
});

describe('flush', function(){
	it('should empty the list of events', function(){
		eventUtils.processDateRange('2019_01_01', '2019_01_02', "hello1");
		eventUtils.processDateRange('2018_01_01', '2018_01_02', "hello2");
		expect(eventUtils.length()).to.be.equal(2);
		eventUtils.flush();
		expect(eventUtils.length()).to.be.equal(0);
		expect(eventUtils.eventsToStringArray()).to.be.eql([]);
	});
});
describe('processEventStrArray', function(){
	it('should process a list of events in string format using a function that extracts the event variables', function(){
		var strArray = [
			"Event from 2018-03-13 to 2018-03-28: fds</li>",
			"Event from 2019-03-13 to 2019-05-20: fds</li>",
			"Event from 2019-03-13 to 2019-03-28: fds</li>"];
		var format = function(str){
			var vals = /Event from ([\d-]+) to ([\d-]+)\:\s(.*?)<\/li>/.exec(str).slice(1,4);
			return vals.map(ev => ev.replace(/\-/g,"_"));
		};
		eventUtils.processEventStrArray(strArray, format);
		expect(eventUtils.length()).to.be.equal(3);

	});
	it('should ignore events in the string format that don', function(){
		eventUtils.flush();
		var strArray = [
			"Event from 2018-03-13 to 2018-03-28: fds</li>",
			"Event from 2019-03-13 to 2019-05-20: fds</li>",
			"Event from 2019-03-13 to 2019-03-28: fds</li>"];
		var format = function(str){
			var vals = /Event from ([\d-]+) to ([\d-]+)\:\s(.*?)<\/li>/.exec(str).slice(1,4);
			return vals.map(ev => ev.replace(/\-/g,"_"));
		};
		eventUtils.processEventStrArray(strArray, format);
		expect(eventUtils.length()).to.be.equal(3);
	});

});
describe('eventExistsAt', function(){
	it('should return true if an event exists at the dateStamp passed in as argument', function(){
		expect(eventUtils.eventExistsAt("2019_03_13")).to.be.equal(true);
	});
	it('should return false if no event exists at the dateStamp passed in as argument', function(){
		expect(eventUtils.eventExistsAt("2019_06_13")).to.be.equal(false);
		eventUtils.flush();
	});
});
describe('eventsAt', function(){
	it('should return a list of all events at the dateStampe passed in as argument', function(){
		expect(eventUtils.length()).to.be.equal(0);
		eventUtils.processDateRange('2019_02_15', '2019_06_15', "some march event");
		eventUtils.processDateRange('2019_03_15', '2019_03_15', "some march event", "with a description");
		expect(eventUtils.eventsAt('2019_03_15').length).to.be.equal(2);
		expect(eventUtils.eventsAt('2018_03_15').length).to.be.equal(0);
	});
});
