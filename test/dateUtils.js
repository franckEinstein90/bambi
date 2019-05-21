const expect = require('chai').expect;
const timeSpanUtils = require('../src/dateUtils.js').timeSpanUtils;
const dateUtils = require('../src/dateUtils.js').dateUtils;


const todayDate = new Date();
const todayStamp = `${todayDate.getFullYear().toString()}_${(todayDate.getMonth()+1).toString().padStart(2,'0')}_${todayDate.getDate().toString().padStart(2,'0')}`;

describe('timeSpanUtils.TimeSpan object', function() {
    describe('TimeSpan.constructor', function() {
        it('is created using two dates', function() {
            let April24_2010 = new Date(2010, 03, 24);
            let April27_2010 = new Date(2010, 03, 27);

            let ts = new timeSpanUtils.TimeSpan(April24_2010, April27_2010, "day");
            expect(ts).to.have.property('beginDate');
            expect(ts).to.have.property('endDate');
            expect(ts).to.have.property('includes');
        })
        it('throws an exception if the first date is after the second date', function() {
            let May24_2010 = new Date(2010, 04, 24);
            let April27_2010 = new Date(2010, 03, 27);

            expect(function() {
                new timeSpanUtils.TimeSpan(May24_2010, April27_2010, "day");
            }).to.throw(timeSpanUtils.invalidDateSpan);
        })
    })

    describe('timeSpanUtils.TimeSpan.includes', function() {
        it('indicates if a given date is included in a time span', function() {
            let April24_2010 = new Date(2010, 03, 24),
                April27_2013 = new Date(2013, 03, 27),
                ts = new timeSpanUtils.TimeSpan(April24_2010, April27_2013, "year");
            expect(ts.includes(new Date(2010, 03, 24))).to.equal(true);
            expect(ts.includes(new Date(2016, 03, 28))).to.equal(false);
            ts.setStep("month");
            expect(ts.includes(new Date(2010, 03, 28))).to.equal(true);
            expect(ts.includes(new Date(2010, 02, 28))).to.equal(false);
            ts.setStep("day");
        })
    })
})

describe('timeSpanUtils.Day constructor', function(){
        it('is created using a single date', function() {
            let April24_2010 = new Date(2010, 03, 24), 
            	ts = new timeSpanUtils.Day(April24_2010);
            expect(ts).to.have.property('weekDayIdx');
        })
	describe('timeSpanUtils.Day.weekDayIdx', function(){
		it('returns the weekday index (0-Sunday to 6-Saturday) of that day', function(){
			let Wednesday22May2019 = new Date(2019, 04, 22), 
			d = new timeSpanUtils.Day(Wednesday22May2019);
			expect(d.weekDayIdx).to.equal(3);
		})
	})
})

describe('setSeparator', function() {
    it('should set the separator for datestamps', function() {
        dateUtils.setSeparator("-");
        expect(dateUtils.dayStamp(2980, 06, 12)).to.be.equal("2980-07-12");
        expect(dateUtils.dayStamp(1980, 6, 2)).to.be.equal("1980-07-02");
        dateUtils.setSeparator("_");
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

describe('dayStamp', function() {
    it('should return a date stamp in the format: yyyy_mm_dd', function() {
        expect(dateUtils.dayStamp(2980, 06, 12)).to.be.equal("2980_07_12");
        expect(dateUtils.dayStamp()).to.be.equal(todayStamp);
        expect(dateUtils.dayStamp(1980, 6, 2)).to.be.equal("1980_07_02");
    });
});

describe('dayStampToDate', function() {
    it('should return a new date based on a string date stamp in format: yyyy_mm_dd', function() {
        expect(dateUtils.dayStampToDate("2019_04_01").toDateString()).to.be.equal(new Date(2019, 3, 1).toDateString());
        dateUtils.setSeparator("-");
        expect(dateUtils.dayStampToDate("2018-01-04").toDateString()).to.be.equal(new Date(2018, 0, 4).toDateString());
        dateUtils.setSeparator("_");
    });
});

describe('dateToDayStamp', function() {
    it('returns a date stamp based on a date argument', function() {
        expect(dateUtils.dateToDayStamp(new Date())).to.be.equal(todayStamp);
    });
});
