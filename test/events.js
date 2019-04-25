
var expect = require('chai').expect;
var validator = require('validator');
var Events = require('../src/Events').Events;

describe('Event Object', function(){
  it("has a status of ongoing or offgoing", function(){
    let ev = new Events.Event();
    expect(ev).to.not.be.undefined;
  })
  it("has a status of ongoing or offgoing", function(){
    let ev = new Events.Event();
    expect(ev.status).to.equal("ongoing");
  })
  it("has a unique identifier", function(){
    let ev = new Events.Event();
    expect(validator.isUUID(ev.id)).to.equal(true);
  })
  describe("events.Event.on()", function(){
    it("turns on the event", function(){
	let ev = new Events.Event();
	ev.off();
        expect(ev.status).to.equal("offgoing");
	ev.on();	
        expect(ev.status).to.equal("ongoing");
    })
  })
  describe("events.Event.off()", function(){
    it("turns off the event", function(){
	let ev = new Events.Event();
	ev.off();	
        expect(ev.status).to.equal("offgoing");
    })
  })
});
