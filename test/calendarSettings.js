const expect = require('chai').expect;
const timeSpan = require('../src/client/dateUtils/timeSpan').timeSpan;
const calendarSettings = require('../src/client/calendarSettings').calendarSettings;

describe ('calendarSettings module', function(){
	it('should be defined', function(){
		expect(calendarSettings).to.not.be.undefined;
	});
	it('is initialized to today date' , function(){
		let todayDate = new Date();
		expect(calendarSettings.selectedYear()).to.equal(todayDate.getFullYear());
		expect(calendarSettings.selectedMonth()).to.equal(todayDate.getMonth());
		expect(calendarSettings.selectedDay()).to.equal(todayDate.getDate());
	});
	it('is in mode "months" by default', function(){
		expect(calendarSettings.selectedMode()).to.equal(timeSpan.units.months);
	});
});

describe('set', function(){
	it('it sets the calendar to a given date', function(){
		let June_14_2008 = new Date(2008, 05, 14);
		calendarSettings.set({year:2008, month:05, day:14});
		expect(calendarSettings.selectedYear()).to.be.equal(2008);
		expect(calendarSettings.selectedMonth()).to.be.equal(05);
		expect(calendarSettings.selectedDay()).to.be.equal(14);
		});
});

describe('reset', function(){
	it('it resets the calendar to today date', function(){
		let June_14_2008 = new Date(2008, 05, 14);
		calendarSettings.set({year:2008, month:05, day:14});
		calendarSettings.reset();
		let todayDate = new Date();
		expect(calendarSettings.selectedYear()).to.equal(todayDate.getFullYear());
		expect(calendarSettings.selectedMonth()).to.equal(todayDate.getMonth());
		expect(calendarSettings.selectedDay()).to.equal(todayDate.getDate());
		});
});

describe('calendarSettings.selectedYear()', function(){
	it('return the current year at which the calendar is set', function(){
		calendarSettings.set({year:2038, month:05, day:14});
		expect(calendarSettings.selectedYear()).to.equal(2038);
	});
});

describe('calendarSettings.nextMonth()', function(){
	it('advances the calendar to the 1st, a month forward',  function(){
		calendarSettings.set({year:2038, month:05, day:14});
		calendarSettings.nextMonth();
		expect(calendarSettings.selectedYear()).to.equal(2038);
		expect(calendarSettings.selectedMonth()).to.equal(06);
		expect(calendarSettings.selectedDay()).to.equal(1);

		calendarSettings.set({year:2018, month:11, day:14});
		calendarSettings.nextMonth();
		expect(calendarSettings.selectedYear()).to.equal(2019);
		expect(calendarSettings.selectedMonth()).to.equal(0);
		expect(calendarSettings.selectedDay()).to.equal(1);
	});
});
describe('calendarSettings.previousMonth()', function(){
	it('sets the current date to the 1st, a month backwards',  function(){
		calendarSettings.set({year:2038, month:05, day:14});
		calendarSettings.previousMonth();
		expect(calendarSettings.selectedYear()).to.equal(2038);
		expect(calendarSettings.selectedMonth()).to.equal(04);
		expect(calendarSettings.selectedDay()).to.equal(1);

		calendarSettings.set({year:2018, month:0, day:14});
		calendarSettings.previousMonth();
		expect(calendarSettings.selectedYear()).to.equal(2017);
		expect(calendarSettings.selectedMonth()).to.equal(11);
		expect(calendarSettings.selectedDay()).to.equal(1);
	});
});

describe('calendarSettings.current()', function(){
	it('returns true if the current date is the same as todays',  function(){
		calendarSettings.reset();
		expect(calendarSettings.current()).to.equal(true);

		calendarSettings.set({year:2018, month:0, day:14});
		expect(calendarSettings.current()).to.equal(false);
	});
});



