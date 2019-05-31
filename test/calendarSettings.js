const expect = require('chai').expect;
const calendarSettings = require('../src/client/calendarSettings.js');


describe('set', function(){
	context('with no arguments', function(){
		calendarSettings.set();
		it('should set the calendar controller to handle +/- 10 years', function(){
			expect(calendarSettings.beginYear).to.be.equal(2010);
		});
	});
});

describe('calendarSettings.year', function(){
	it('return the current year at which is set', function(){
		expect(calendarSettings.year()).to.equal(2019);
	});
});



