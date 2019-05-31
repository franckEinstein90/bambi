/******************************************************************************
 * tests for calendarEvents module
 * FranckEinstein90
 * ----------------
 * tests library at src/calendarEvents.js
 * ***************************************************************************/

const expect = require('chai').expect;
const validator = require('validator');

const events = require('../src/client/events').events;
const calendarEvents = require('../src/client/calendarEvents').calendarEvents;


/******************************************************************************
 * calendarEvents.Event
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
        expect(ev.state).to.equal(events.eventState.on);
    })
})


/******************************************************************************
 * 
 *
 * ***************************************************************************/


