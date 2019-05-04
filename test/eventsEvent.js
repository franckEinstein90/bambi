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

    it("has prorpeties 'state' and 'id'", function() {
        let ev = new events.Event();
        expect(ev).to.have.property("state");
        expect(ev).to.have.property("id");
    })

    it("is created with state 'on' by default", function() {
        let ev = new events.Event();
        expect(ev).to.not.be.undefined;
        expect(ev.state).to.equal(events.eventState.on);
        expect(ev.isOn()).to.equal(true);
    })

    it("can be created with state 'off' by passing an argument", function() {
        let ev = new events.Event(events.eventState.off);
        expect(ev.state).to.equal(events.eventState.off);
    })

    it("has a unique identifier", function() {
        let ev = new events.Event();
        expect(validator.isUUID(ev.id)).to.equal(true);
    })

    describe("events.Event.on()", function() {
        it("turns on the event", function() {
            let ev = new events.Event();
            ev.off();
            expect(ev.state).to.equal(events.eventState.off);
            ev.on();
            expect(ev.state).to.equal(events.eventState.on);
        })
    })

})

describe("events.Event.off()", function() {
        it("turns off the event", function() {
            let ev = new events.Event();
            ev.off();
            expect(ev.state).to.equal(events.eventState.off);
        })

        it("can be attached to one or several event handlers", function() {
            let ev = new events.Event(), 
                localVar = 0;
 
            ev.onOffActions.push( () => localVar += 1);
            ev.off();
            expect(ev.state).to.equal(events.eventState.off);
            expect(ev.isOff()).to.equal(true);
            expect(localVar).to.equal(1);
        })
})


describe("events.Event.flip()", function() {
        it("flips the current state of the event", function() {
            let ev = new events.Event();
            ev.off();
            ev.flip();
            expect(ev.state).to.equal(events.eventState.on);
            ev.flip();
            expect(ev.isOff()).to.equal(true);
        })

        it("can be attached to event handlers", function(){
           let ev = new events.Event(), 
               hereVar = 0; 

           ev.onFlipActions.push(() => hereVar += 1);
           ev.flip();
           expect(hereVar).to.equal(1);
        })
})

