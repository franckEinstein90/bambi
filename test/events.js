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

    describe("events.Event.off()", function() {
        it("turns off the event", function() {
            let ev = new events.Event();
            ev.off();
            expect(ev.state).to.equal(events.eventState.off);
        })
    })
});

/*************************************************************
 * events.Registrar
 * FranckEinstein90
 * -------------------
 *  Structure into which events can be registered. Provides
 *  various operations on the set of registered events, map, 
 *  filter, reduce
 * **********************************************************/

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

    describe('events.Registrar.filter', function() {
        it("filters the registrar according to a given predicate", function() {
            let evOff1 = new events.Event(events.eventState.off),
                evOff2 = new events.Event(events.eventState.off),
                evOn1 = new events.Event(events.eventState.on);

            [evOff1, evOff2, evOn1].forEach(x => evRegistrar.register(x));

            expect(evRegistrar.filter(x => x.isOn()).length).to.equal(1);
            expect(evRegistrar.filter(x => x.isOff()).length).to.equal(2);
        })

    })

    describe('events.Registrar.register', function() {

        it('registers an event in the registrar', function() {
            let ev = new events.Event();
            evRegistrar.flush();
            evRegistrar.register(ev);
            expect(evRegistrar.size()).to.equal(1);
        })

        it('it registers an array of events in the registrar', function() {

        })
    })

    describe('events.Registrar.get', function() {

        it('gets an event from the registrar', function() {
            let ev = new events.Event();
            evRegistrar.register(ev);
            expect(evRegistrar.get(ev.id).id).to.equal(ev.id);
        });

    })

    describe('events.Registrar.forEach', function() {

        it('applies a callback to every member of the registrar', function() {
            let ev1 = new events.Event();
            evRegistrar.register(ev1);
            evRegistrar.forEach(x => expect(x.state).to.equal(events.eventState.on));

        })
    })

    describe('events.Registrar.flush()', function() {

        it('empties the registrar', function() {
            evRegistrar.flush();
            expect(evRegistrar.size()).to.equal(0);
        });
    })

});
