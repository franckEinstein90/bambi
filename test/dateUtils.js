var expect = require('chai').expect;
var calUtils = require('../app/dateUtils.js');

var todayDate = new Date();
var todayStamp = `${todayDate.getFullYear().toString()}_${(todayDate.getMonth()+1).toString().padStart(2,'0')}_${todayDate.getDate().toString()}`;
describe('monthIdxToStr', function(){
	it('should return the string rep of a month based on its index', function(){
		expect(calUtils.monthIdxToStr(0)).to.be.equal("January");
		expect(calUtils.monthIdxToStr(11)).to.be.equal("December");
		expect(calUtils.monthIdxToStr(4)).to.be.equal("May");
	});
});
describe('dayStamp', function(){
	it('should return a date stamp in the format: yyyy_mm_dd', function(){
		expect(calUtils.dayStamp(2980,06,12)).to.be.equal("2980_07_12");
		expect(calUtils.dayStamp()).to.be.equal(todayStamp);
		expect(calUtils.dayStamp(1980,6, 2)).to.be.equal("1980_07_02");
	});
});
describe('dayStampToDate', function(){
	it('should return a new date based on a string date stamp in format: yyyy_mm_dd', function(){
		expect(calUtils.dayStampToDate("2019_04_01").toDateString()).to.be.equal(new Date(2019, 3, 1).toDateString());
	});
});

describe('dateToDayStamp', function(){
	it('returns a date stamp based on a date argument', function(){
		expect(calUtils.dateToDayStamp(new Date())).to.be.equal(todayStamp);
	});
});

	

