const expect = require('chai').expect;
const scheduler = require('../src/scheduler').eventChainUtils;



describe('scheduler', function() {

    describe('scheduler.Event object', function() {
        //       it('is created using a value and an integer index');
        //        the integer index is unique so if it exists, it gets replaced


    })
    describe('setValues()', function() {
        it('takes a array of values as argument and stores them in the scheduler', function() {
            scheduler.setValues([3, 5, -7, 8, 10]);
        })
    })
    describe('setSubsetPredicate', function() {
        it('takes a function that returns true if a valid subset of the values is passed as argument', function() {
            let predicate = function(subset) {
                return true;
            };
            scheduler.setSubsetPredicate(predicate);
        })
    })
    describe('listValidSubsets', function() {
        it('lists all possible valid subsets', function() {})
    })
    describe('maximum subset', function() {
        it('Returns the maximum subset', function() {
            scheduler.setValues([1, 15, 10, 13, 16]);
            expect(scheduler.calculated(2, 2)).to.equal(10);
            expect(scheduler.calculated(2, 3)).to.equal(13);
            expect(scheduler.calculated(0, 3)).to.equal(28);
            expect(scheduler.calculated(3, 3)).to.equal(13);
            expect(scheduler.calculated(1, 3)).to.equal(28);
            expect(scheduler.calculated(0, 4)).to.equal(31);
        })
        it('handles negative values by default as any other values', function() {
            scheduler.setValues([3, 5, -7, 8, 10]);
            expect(scheduler.calculated(0, 4)).to.equal(15);
        })
        it('has a convenience function called maxSubset', function() {
            scheduler.setValues([3, 7, 4, 6, 5]);
            expect(scheduler.maxSubset()).to.equal(13);

        });
    });
});