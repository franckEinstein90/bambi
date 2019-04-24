const Events = require('./events.js').Events;


let eventChainUtils = (function() {
    //An eventChain is an array of consecutive events constructed 
    //from an ordered array of events.Each in-order possible subsets 
    //of the argument array are potential chains of events. 
    //So for example [Ev0, Ev1, Ev2] defines the following possible 
    //chains of events: 
    //(Ev0, Ev1, Ev2), (Ev1, Ev2), (Ev0, Ev1), (Ev0, Ev2), (Ev1, Ev2), (Ev0), (Ev1), (Ev2)

    let values,
        rangeValues,
        isValidSubset = x => true;
    return {
        Event: function(value, index) {
            this.value = value;
            this.index = index;
            Events.Event.call(this);
        },
        setValues: function(eventArray) {
            values = eventArray.slice();
            rangeValues = values.map(x => []);
            rangeValues.forEach((val, idx) => val[idx] = values[idx]);
        },
        setSubsetPredicate: function(predicate) {
            isValidSubset = predicate
        },
        listValidSubsets: function() {
            let validSubsets = [],
                validSubsetsFrom = function(idxBegin) {
                    if ((idxBegin == values.length - 1) && isValidSubset([idxBegin])) {
                        validSubsets.push([idxBegin]);
                        return [idxBegin];
                    }
                    let subsets = validSubsetsFrom(idxBegin + 1);
                    validSubsets.push(subsets);
                    subsets.forEach(x => x.push(idxBegin));
                    validSubsets.push(subsets);
                };
            return validSubsetAssembler(0, values.length - 1);
        },
        calculated: function(idxBegin, idxEnd) {
            if (rangeValues[idxBegin][idxEnd] !== undefined) {
                return rangeValues[idxBegin][idxEnd];
            }
            if (idxBegin + 1 == idxEnd) {
                rangeValues[idxBegin][idxEnd] = Math.max(values[idxBegin], values[idxEnd]);
                return rangeValues[idxBegin][idxEnd];
            }
            let withoutAction = eventChainUtils.calculated(idxBegin + 1, idxEnd);
            let withAction = eventChainUtils.calculated(idxBegin + 2, idxEnd) + values[idxBegin];
            rangeValues[idxBegin][idxEnd] = Math.max(withoutAction, withAction);
            return rangeValues[idxBegin][idxEnd];
        },
        maxSubset: function() {
            return eventChainUtils.calculated(0, values.length - 1);
        }
    };
})();



module.exports = {
    eventChainUtils
};