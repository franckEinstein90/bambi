const expect = require('chai').expect;

const timeSpan = require('../src/client/dateUtils/timeSpan').timeSpan;
const dateUtils = require('../src/client/dateUtils/dateUtils').dateUtils;



describe('dayStamp', function() {
    it("should return today's date stamp when called with no arguments", function(){
	let todayDate = new Date(),
	    todayStamp = `${todayDate.getFullYear().toString()}_${(todayDate.getMonth()+1).toString().padStart(2,'0')}_${todayDate.getDate().toString().padStart(2,'0')}`;
        expect(dateUtils.dayStamp()).to.be.equal(todayStamp);
    });

    it('should return a date stamp in the format: yyyy_mm_dd', function() {
        expect(dateUtils.dayStamp({year:2980, month:06, day:12})).to.equal("2980_07_12");
        expect(dateUtils.dayStamp({year:1980, month:6, day:2})).to.equal("1980_07_02");
    });
});

describe('pushSeparator', function() {
    it('Sets a new separator for datestamps', function() {
	let originalSeparator = dateUtils.separator(), 
	    newSeparator = ("=");

        dateUtils.pushSeparator(newSeparator);
        expect(dateUtils.separator()).to.equal(newSeparator);
        dateUtils.popSeparator();
        expect(dateUtils.separator()).to.equal(originalSeparator);
    });
});

describe('pushSeparator', function() {
    it('Sets a new separator for datestamps', function() {
        dateUtils.pushSeparator("-");
        expect(dateUtils.dayStamp({year:2980, month:06, day:12})).to.equal("2980-07-12");
        expect(dateUtils.dayStamp({year:1980, month:6, day:2})).to.equal("1980-07-02");
        dateUtils.popSeparator();
    });
});

describe('monthLength', function() {
    it('should return the number of days in a month', function() {
        expect(dateUtils.monthLength(2000, 0)).to.be.equal(31);
        expect(dateUtils.monthLength(2016, 1)).to.be.equal(29);
    });
});

describe('monthIdxToStr', function() {
    it('should return the string rep of a month based on its index', function() {
        expect(dateUtils.monthIdxToStr(0)).to.be.equal("January");
        expect(dateUtils.monthIdxToStr(11)).to.be.equal("December");
        expect(dateUtils.monthIdxToStr(4)).to.be.equal("May");
  });
});

describe('dayStampToDate', function() {
    it('should return a new date based on a string date stamp in format: yyyy_mm_dd', function() {
	dateUtils.pushSeparator("_");
        expect(dateUtils.dayStampToDate("2019_04_01").toDateString()).to.equal(new Date(2019, 3, 1).toDateString());
        dateUtils.pushSeparator("-");
        expect(dateUtils.dayStampToDate("2018-01-04").toDateString()).to.equal(new Date(2018, 0, 4).toDateString());
    });
});

describe('dateToDayStamp', function() {
    it('returns a date stamp based on a date argument', function() {
       	let todayDate = new Date();
	dateUtils.pushSeparator(":");
	todayStamp = `${todayDate.getFullYear().toString()}:${(todayDate.getMonth()+1).toString().padStart(2,'0')}:${todayDate.getDate().toString().padStart(2,'0')}`;
        expect(dateUtils.dateToDayStamp(new Date())).to.equal(todayStamp);
    });
});
