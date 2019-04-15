var expect = require('chai').expect;
var calendarSettings = require('../src/calendarSettings.js');


describe('init', function(){
	context('with no arguments', function(){
		calendarSettings.init();
		it('should set the calendar controller to handle +/- 10 years', function(){
			expect(calendarSettings.beginYear()).to.be.equal(2010);
		});
	});
});
describe('setMonth', function(){
	it('changes the month setting of the calendar ', function(){
		expect(calendarSettings.getYear()).to.be.equal(2019);
	});
});

describe('setSeparator', function(){
	it('should ', function(){
		expect(calendarSettings.getYear()).to.be.equal(2019);
	});
});
