/*******************************************************************
 * events namespace
 * FranckEinstein90
 * ---------------
 *
 *  events.Event: Include implementations for:
 *
 *  - object events.Event, base class for all other event object in system
 *    . has status on or off
 *    . can be flipped from one to the other
 *    . has a unique id
 *  
 *  - object events.Chain, implements concept of a chain of events
 *    . sets of events that are linked to one another
 *
 *  - object events.Register, keeps tracks of all objects and their status
 *
 *  ------------
 *  Unit tests: /test/events.js
 *  Dependent modules: /src/calendarEvents.js
 * 
 * *****************************************************************/

const events = (function() {


    let eventRegistrar = new Map(),

        generateUUID = function() {
            let d = new Date().getTime();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        };

    return {

        eventStatus: {
            on: 1,
            off: 0
        },

        /*************************************************************
         * events.Event
         * FranckEinstein90
         * -------------------
         *
         *  base event abstraction. A wrapper for:  
         *   - a unique id
         *   - a status of on or off
         *
         * **********************************************************/
        Event: function(state) { // events.Event registered at construction
            this.id = generateUUID();
            if (state === undefined) {
                this.state = events.eventStatus.on;
            } else {
                this.state = state
            }
            eventRegistrar.set(this.id, this.state);
        },

        /*************************************************************
         * events.Chain
         * -------------------
         *  Structure that links events to each other
         *  provides facilities to create webs of related 
         *  events
         * **********************************************************/
        Chain: function() {
            //todo
        },

        /*************************************************************
         * events.Registrar
         * -------------------
         *  Structure into which events can be registered. Provides
         *  various operations on the set of registered events, map, 
         *  filter, reduce
         * **********************************************************/

        Registrar: function() { // Event registrar
            this.events = new Map();
        },

        /*************************************************************
         * events.Exception
         * -------------------
         *  Error Structure 
         * **********************************************************/
        Exception: function(err) {

        }
    };
})();



/******************************************************************************
 * Event class related
 * 
 * ***************************************************************************/
events.Event.prototype.on = function() { //event is ongoing
    this.state = events.eventStatus.on;
}

events.Event.prototype.off = function() { //event is offgoing
    this.state = events.eventStatus.off;
}

events.Event.prototype.isOn = function() {
    return (this.state == events.eventStatus.on);
}
events.Event.prototype.isOff = function() {
    return (this.state === events.eventStatus.off);
}
/******************************************************************************
 * Registrar class
 * -----------------
 *  data structure that holds and registers events, 
 *  keeping track of their status
 * 
 * ***************************************************************************/
events.Registrar.prototype.register = function(ev) {
    this.events.set(ev.id, ev);
}

events.Registrar.prototype.size = function(ev) {
    return this.events.size;
}

events.Registrar.prototype.flush = function(ev) {
    return this.events.clear();
}

events.Registrar.prototype.forEach = function(eventCallbackFunction) {
    this.events.forEach(eventCallbackFunction);
}

events.Registrar.prototype.get = function(eventId) {
    return this.events.get(eventId);
}

events.Registrar.prototype.filter = function(filterPred) {
    /********************************************************
     * returns an array of events filtered as 
     * per the predicate argument
     * *****************************************************/
    let arrayRes = [];
    this.events.forEach((value, key) => {
        if (filterPred(value)) {
            arrayRes.push(value)
        }
    });
    return arrayRes;
}

events.Registrar.prototype.remove = function(evId) {
    /********************************************************
     * removes an event with given id from 
     * the registrar
     * *****************************************************/
    if (!this.events.has(eventId)) {
        throw new events.Exception("Event does not exist");
    }
    this.events.delete(eventId);
}



module.exports = {
    events
};