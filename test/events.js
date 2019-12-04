/*******************************************************************
 * tests for events namespace objects and functions
 * FranckEinstein90
 * ----------------
 *
 ********************************************************************/

const expect = require('chai').expect;
const validator = require('validator');
const events = require('../src/core/events').events;

/*************************************************************
 * events.Registrar
 * FranckEinstein90
 * -------------------
 *  Structure into which events can be registered. Provides
 *  various operations on the set of registered events, map, 
 *  filter, reduce
 * **********************************************************/



describe('events.event Object', function() {

 /******************************************************
  * construction tests
  * ***************************************************/
    it("is created with state 'on' by default", function() {
        let ev = new events.Event();
        expect(ev).to.not.be.undefined;
        expect(ev.state).to.equal(events.eventState.on);
        expect(ev.isOn).to.equal(true);
    })

    it("can be created with state 'off' by argument", function() {
        let ev = new events.Event(events.eventState.off);
        expect(ev.isOn).to.equal(false);
        expect(ev.isOff).to.equal(true);
        expect(ev.state).to.equal(events.eventState.off);
    })

    it("has a unique identifier", function() {
        let ev = new events.Event();
        expect(validator.isUUID(ev.id)).to.equal(true);
    })

    describe("events.Event.off()", function() {
        it("turns off the event", function() {
            let ev = new events.Event();
            ev.off();
            expect(ev.state).to.equal(events.eventState.off);
            expect(ev.isOff).to.equal(true);
            expect(ev.isOn).to.equal(false);
        })
    })

    it("can be attached to one or several event handlers", function() {
            let ev = new events.Event(), 
                localVar = 0;
 
            ev.onOffActions.push( () => localVar += 1);
            ev.off();
            expect(ev.state).to.equal(events.eventState.off);
            expect(ev.isOff).to.equal(true);
            expect(localVar).to.equal(1);
        })
});


describe("events.Event.flip()", function() {
        it("flips the current state of the event", function() {
            let ev = new events.Event();
            ev.off();
            ev.flip();
            expect(ev.state).to.equal(events.eventState.on);
            ev.flip();
            expect(ev.isOff).to.equal(true);
        })

        it("can be attached to event handlers", function(){
           let ev = new events.Event(), 
               hereVar = 0; 

           ev.onFlipActions.push(() => hereVar += 1);
           ev.flip();
           expect(hereVar).to.equal(1);
        })
})


describe('events.Registrar Object', function() {

    let evRegistrar = new events.Registrar();

    it('has the following methods and properties', function() {
        ["remove", "filter",
            "forEach",
            "size", "flush",
            "register", "get"
        ].forEach(x =>
            expect(evRegistrar).to.have.property(x));
    })

    describe('events.Registrar.register ', function() {
        it('stores events in the register', function() {
            let evOff1 = new events.Event(events.eventState.off), 
            evOff2 = new events.Event(events.eventState.off), 
            evOn1 = new events.Event();
            [evOff1, evOff2, evOn1].forEach(x => evRegistrar.register(x));
            expect(evRegistrar.size).to.equal(3);
        })
    })

    describe('events.Registrar.flush()', function() {
        it('empties the registrar', function() {
            evRegistrar.flush();
            expect(evRegistrar.size).to.equal(0);
        })
    })
})



/*********************************************************************/
/* Bread and butter handlers 
/*********************************************************************/

describe('calendarEvent.remove(evId)', function() {
    let evRegistrar = new events.Registrar();

    beforeEach(function() {
        evRegistrar.flush();
    })

    it("throws a non-existing event exception if the argument id doesn't exists", function() {
        let ev = new events.Event();
        expect(function() {
            evRegistrar.remove(ev.id);
        }).to.throw('Event does not exist');
        expect(evRegistrar.size).to.equal(0);
    })
})

describe('Registrar object get method', function() {
    let evRegistrar = new events.Registrar();

    beforeEach(function() {
        evRegistrar.flush();
    })

    it('returns an event stored in the event store with the given id', function() {
        let ev = new events.Event();
        evRegistrar.register(ev);
        let ev2 = evRegistrar.get(ev.id);
        expect(ev2.id).to.equal(ev.id);
    })
})


