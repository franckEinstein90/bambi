const events = (function() {

    generateUUID = () => {
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    return {
        eventState: {
            on: 1,
            off: 0
        },
        Event: function(state) {
            this.id = generateUUID();
            this.state = state ? state : eventState.on;
        },
	Registrar: function(){
	   this.events = new Map();
	}
    };
})();

events.Event.prototype = {
        get isOn() {
            return (this.state === events.eventState.on)
        },
        get isOff() {
            return (this.state === events.eventState.off)
        },
        on: function() {
            if (this.isOff()) {
                this.state === events.eventState.on;
            }
        },
        off: function() {
            if (this.isOn()) {
                this.state === events.eventState.off;
            }
        }
}

/******************************************************************************
 * Registrar class
 * -----------------
 *  data structure that holds and registers events, 
 *  keeping track of their status
 * 
 * ***************************************************************************/
events.Registrar.prototype = {

    get size() {
        return this.events.size;
    },

   /*****************************************************************
     *  Registers an event in the registrar
     *  *************************************************************/
    register: function(ev) {
        this.events.set(ev.id, ev);
    },

    flush: function(ev) {
        return this.events.clear();
    },

    forEach: function(eventCallbackFunction) {
        this.events.forEach(eventCallbackFunction);
    },

    get: function(eventId) {
        return this.events.get(eventId);
    },

    filter: function(filterPred) {
        /********************************************************
         * returns an array of events filtered as 
         * per the predicate argument
         * *****************************************************/
        let arrayRes = [];
        this.events.forEach((value, key) => {
            if (filterPred(value)) {
                arrayRes.push(value);
            }
        });
        return arrayRes;
    },
    remove: function(evId) {
        /********************************************************
         * removes an event with given id from 
         * the registrar
         * *****************************************************/
        if (!this.events.has(evId)) {
            throw new events.Exception("Event does not exist");
        }
        this.events.delete(evId);
    }


};
