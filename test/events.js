/*******************************************************************
 * tests for events namespace objects and functions
 * FranckEinstein90
 * ----------------
 *
 ********************************************************************/

const expect = require('chai').expect;
const validator = require('validator');
const events = require('../src/events').events;

describe('Event Object', function() {

/******************************************************************************
 * construction tests
 * ***************************************************************************/
    it("has a status of ongoing or offgoing", function() {
        let ev = new events.Event();
        expect(ev).to.not.be.undefined;
        expect(ev.status).to.equal("ongoing");
    })

    it("has a unique identifier", function() {
        let ev = new events.Event();
        expect(validator.isUUID(ev.id)).to.equal(true);
    })


    describe("events.Event.on()", function() {
        it("turns on the event", function() {
            let ev = new events.Event();
            ev.off();
            expect(ev.status).to.equal("offgoing");
            ev.on();
            expect(ev.status).to.equal("ongoing");
        })
    })

    describe("events.Event.off()", function() {
        it("turns off the event", function() {
            let ev = new events.Event();
            ev.off();
            expect(ev.status).to.equal("offgoing");
        })
    })
});
