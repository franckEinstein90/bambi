/******************************************************************************
 * tests for calendarEvents module
 * FranckEinstein90
 * ----------------
 *
 * ***************************************************************************/

const expect = require('chai').expect;
const validator = require('validator');
const calendarEvents = require('../src/calendarEvents').calendarEvents;

/******************************************************************************
 * 
 *
 * ***************************************************************************/

let today = new Date();
describe('hooks', function() {
    beforeEach(function() {
        calendarEvents.flush();
    })
});


/******************************************************************************
 * Calendar events tests
 *
 * ***************************************************************************/
describe('Calendar event object', function() {
    it('is constructed using two dates and a string', function() {
        let ev = new calendarEvents.CalendarEvent(new Date(), new Date(), "x");
        expect(ev).to.not.be.undefined;
    })
    it('assigns a unique RFC4122 ID to each event', function() {
        let ev = new calendarEvents.CalendarEvent(new Date(), new Date(), "x");
        expect(validator.isUUID(ev.id)).to.equal(true);
    })
    it('has on and off methods', function() {
        let ev = new calendarEvents.CalendarEvent(new Date(), new Date(), "x");
        expect(ev).to.have.property("on");
    })
})


/******************************************************************************
 * 
 *
 * ***************************************************************************/

describe('calendarEvents.register', function() {
    beforeEach(function() {
        calendarEvents.flush();
    })

    it('Registers an event in the event store', function() {
        expect(calendarEvents.size()).to.be.equal(0);
        let ev = new calendarEvents.CalendarEvent(new Date(), new Date(), "test event");
        calendarEvents.register(ev);
        expect(calendarEvents.size()).to.be.equal(1);
    })

    it("Registers the event as ongoing if the event's date range includes today", function() {
        let ev = new calendarEvents.CalendarEvent(new Date(), new Date(), "test event");
        calendarEvents.register(ev);
        expect(ev.status).to.equal("ongoing");
    })
})


/*********************************************************************/
/* Bread and butter handlers 
/*********************************************************************/

describe('calendarEvent.remove(evId)', function() {
    beforeEach(function() {
        calendarEvents.flush();
    })

    it('removes the event with the given ID from the eventStore', function() {
        let newEventID = calendarEvents.processDateRange('2018_01_01', '2018_01_02', "hello");
        expect(calendarEvents.size()).to.be.equal(1);
        calendarEvents.remove(newEventID);
        expect(calendarEvents.size()).to.be.equal(0);
    })

    it("throws a non-existing event exception if the argument id doesn't exists", function() {
        let newEventID = new calendarEvents.CalendarEvent(new Date(), new Date(), "Easter", "Buy Chocolate").id;
        expect(function() {
            calendarEvents.remove(newEventID);
        }).to.throw('Event does not exist');
        expect(calendarEvents.size()).to.be.equal(0);
    })
})

describe('calendarEvents.get', function() {
    beforeEach(function() {
        calendarEvents.flush();
    })

    it('returns an event stored in the event store with the given id', function() {
        let eventTitle = "test event",
            ev = new calendarEvents.CalendarEvent(new Date(), new Date(), "test event");
        calendarEvents.register(ev);
        expect(calendarEvents.get(ev.id).eventTitle).to.equal(eventTitle);
    })
})

describe('calendarEvents.forEach', function() {
    it('applies a callback to each registered event', function() {
        let events = [],
            resString = "";
        calendarEvents.flush();
        ["a", "b", "c"].forEach(x => calendarEvents.processDateRange("2010_01_02", "2012_03_01", x, "event descri"));
        calendarEvents.forEach(x => resString += x.eventTitle);
        expect(resString).to.equal("abc");
    })
})

describe('newEvent', function() {
    it('should throw an invalid date exception if one of the first two arguments is not a date', function() {
        expect(calendarEvents.newEvent.bind("dfsa", new Date(), "dsa")).to.throw("unexpected argument");
    }

    it('should create a new event using two dates and a string. in string format', function() {
        let ev = calendarEvents.newEvent(new Date(), new Date(), "hello");
        expect(ev).to.exist;
    })

    it('should create a new event using two dates and two strings in string format', function() {
        let ev = calendarEvents.newEvent(new Date(), new Date(), "Xmas", "Santa's coming");
        expect(ev).to.exist;
    })

    it('should throw an invalid date exception the endDate is before the startDate', function() {

    })
})

describe('eventToString', function() {
    it('should output a string representing the body of an event', function() {
        let ev = new calendarEvents.CalendarEvent(new Date("2019/01/01"), new Date("2019/01/02"), "new event");
        expect(calendarEvents.eventToString(ev)).to.be.equal("2019_01_01 2019_01_02 new event");
    })

    it('should output a string representing the body of an event', function() {
        let ev = new calendarEvents.CalendarEvent(new Date("2019/01/01"), new Date("2019/01/02"), "new event", "do something");
        expect(calendarEvents.eventToString(ev)).to.be.equal("2019_01_01 2019_01_02 new event [do something]");
    })
})

describe('processDateRange', function() {

    beforeEach(function() {
        calendarEvents.flush();
    })

    it('creates and registers a new calendar event', function() {
        calendarEvents.processDateRange('2018_01_01', '2018_01_02', "hello");
        expect(calendarEvents.size()).to.be.equal(1);
    })

    it('should return the unique ID of the new event', function() {
        let newEventID = calendarEvents.processDateRange('2018_01_01', '2018_01_02', "hello");
        expect(validator.isUUID(newEventID)).to.equal(true);
    })
})

describe('eventsToStringArray', function() {

    beforeEach(function() {
        calendarEvents.flush();
    })

    it('should output an array of string representing the list of events in the internal event list', function() {
        calendarEvents.processDateRange('2018_01_01', '2018_01_02', "hello");
        expect(calendarEvents.eventsToStringArray()).to.be.eql(["2018_01_01 2018_01_02 hello"]);
    })
})

describe('flush', function() {

    beforeEach(function() {
        calendarEvents.flush();
    })

    it('should empty the list of events', function() {
        calendarEvents.processDateRange('2019_01_01', '2019_01_02', "hello1");
        calendarEvents.processDateRange('2018_01_01', '2018_01_02', "hello2");
        expect(calendarEvents.size()).to.be.equal(2);
        calendarEvents.flush();
        expect(calendarEvents.size()).to.be.equal(0);
        expect(calendarEvents.eventsToStringArray()).to.be.eql([]);
    })
})

describe('processEventStrArray', function() {

    beforeEach(function() {
        calendarEvents.flush();
    })

    it('should register a list of events in string format', function() {
        var strArray = [
            "Event from 2018-03-13 to 2018-03-28: fds</li>",
            "Event from 2019-03-13 to 2019-05-20: fds</li>",
            "Event from 2019-03-13 to 2019-03-28: fds</li>"
        ];
        var format = function(str) {
            var vals = /Event from ([\d-]+) to ([\d-]+)\:\s(.*?)<\/li>/.exec(str).slice(1, 4);
            return vals.map(ev => ev.replace(/\-/g, "_"));
        };
        calendarEvents.processEventStrArray(strArray, format);
        expect(calendarEvents.size()).to.be.equal(3);

    });
    it('should ignore events in the string format that don', function() {
        calendarEvents.flush();
        var strArray = [
            "Event from 2018-03-13 to 2018-03-28: fds</li>",
            "Event from 2019-03-13 to 2019-05-20: fds</li>",
            "Event from 2019-03-13 to 2019-03-28: fds</li>"
        ];
        var format = function(str) {
            var vals = /Event from ([\d-]+) to ([\d-]+)\:\s(.*?)<\/li>/.exec(str).slice(1, 4);
            return vals.map(ev => ev.replace(/\-/g, "_"));
        };
        calendarEvents.processEventStrArray(strArray, format);
        expect(calendarEvents.size()).to.be.equal(3);
    })

})

describe('eventExistsAt', function() {

    it('should return true if an event exists at the dateStamp passed in as argument', function() {
        expect(calendarEvents.eventExistsAt("2019_03_13")).to.be.equal(true);
    });

    it('should return false if no event exists at the dateStamp passed in as argument', function() {
        expect(calendarEvents.eventExistsAt("2019_06_13")).to.be.equal(false);
        calendarEvents.flush();
    });
});

describe('eventsOn', function() {
    it('Returns an array of all calendar events scheduled for the dateStampe passed in as argument', function() {
        expect(calendarEvents.size()).to.be.equal(0);
        calendarEvents.processDateRange('2019_02_15', '2019_06_15', "some march event");
        calendarEvents.processDateRange('2019_03_15', '2019_03_15', "some march event", "with a description");
        expect(calendarEvents.eventsOn('2019_03_15').length).to.be.equal(2);
        expect(calendarEvents.eventsOn('2018_03_15').length).to.be.equal(0);
    })
})
