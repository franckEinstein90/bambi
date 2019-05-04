/*******************************************************************
 * tests for events namespace objects and functions
 * FranckEinstein90
 * ----------------
 *
 ********************************************************************/

const expect = require('chai').expect;
const validator = require('validator');
const events = require('../src/events').events;

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
