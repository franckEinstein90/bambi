const expect = require('chai').expect;
const timeSpan = require('../src/timeSpan.js').timeSpan;


const todayDate = new Date();
const todayStamp = `${todayDate.getFullYear().toString()}_${(todayDate.getMonth()+1).toString().padStart(2,'0')}_${todayDate.getDate().toString().padStart(2,'0')}`;

describe('timeSpanUtils.TimeSpan object', function() {
    describe('TimeSpan.constructor', function() {
        it('is created using two dates', function() {
            let April24_2010 = new Date(2010, 03, 24);
            let April27_2010 = new Date(2010, 03, 27);

            let ts = new timeSpan.Span(April24_2010, April27_2010, "day");
            expect(ts).to.have.property('beginDate');
            expect(ts).to.have.property('endDate');
            expect(ts).to.have.property('includes');
        })
        it('throws an exception if the first date is after the second date', function() {
            let May24_2010 = new Date(2010, 04, 24);
            let April27_2010 = new Date(2010, 03, 27);

            expect(function() {
                new timeSpan.Span(May24_2010, April27_2010, "day");
            }).to.throw(timeSpan.invalidDateSpan);
        })
    })

    describe('timeSpanUtils.TimeSpan.includes', function() {
        it('indicates if a given date is included in a time span', function() {
            let April24_2010 = new Date(2010, 03, 24),
                April27_2013 = new Date(2013, 03, 27),
                ts = new timeSpan.Span(April24_2010, April27_2013, "year");
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
            	ts = new timeSpan.Day(April24_2010);
            expect(ts).to.have.property('weekDayIdx');
        })
	describe('timeSpanUtils.Day.weekDayIdx', function(){
		it('returns the weekday index (0-Sunday to 6-Saturday) of that day', function(){
			let Wednesday22May2019 = new Date(2019, 04, 22), 
			d = new timeSpan.Day(Wednesday22May2019);
			expect(d.weekDayIdx).to.equal(3);
		})
	})
})

