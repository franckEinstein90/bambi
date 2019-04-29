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

    it("is in 'on' statue by default", function() {
        let ev = new events.Event();
        expect(ev).to.not.be.undefined;
        expect(ev.state).to.equal(events.eventStatus.on);
    })

    it("has a unique identifier", function() {
        let ev = new events.Event();
        expect(validator.isUUID(ev.id)).to.equal(true);
    })


    describe("events.Event.on()", function() {
        it("turns on the event", function() {
            let ev = new events.Event();
            ev.off();
            expect(ev.status).to.equal(events.eventStatus.off);
            ev.on();
            expect(ev.status).to.equal(events.eventStatus.on);
        })
    })

    describe("events.Event.off()", function() {
        it("turns off the event", function() {
            let ev = new events.Event();
            ev.off();
            expect(ev.status).to.equal(events.eventStatus.off);
        })
    })
});


describe('events.Registrar Object', function() {
    let evRegistrar = new events.Registrar();
        
    it('has the following methods and properties', function(){
            ["forEach", "size", "flush", "register", "get"].forEach(x => 
            expect(evRegistrar).to.have.property(x));
    })

    
    describe('events.Registrar.register', function(){

        it('registers an event in the registrar', function(){
            let ev = new events.Event();
            evRegistrar.register(ev);
            expect(evRegistrar.size()).to.equal(1);
        });

    })

    describe('events.Registrar.get', function(){

        it('gets an event from the registrar', function(){
            let ev = new events.Event();
            evRegistrar.register(ev);
            expect(evRegistrar.get(ev.id).id).to.equal(ev.id);
        });

    })

    describe('events.Registrar.forEach', function(){

        it('applies a callback to every member of the registrar', function(){
           let ev1 = new events.Event();
           evRegistrar.register(ev1);
           evRegistrar.forEach(x => expect(x.state).to.equal(events.eventStatus.on));
            
        })
    })

    describe('events.Registrar.flush()', function(){

       it('empties the registrar', function(){
            evRegistrar.flush();
            expect(evRegistrar.size()).to.equal(0);
        });
    })

});


