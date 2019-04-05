var expect = require('chai').expect;
var calendarSettings = require('../src/calendarSettings.js');

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
