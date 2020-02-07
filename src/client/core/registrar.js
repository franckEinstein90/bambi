"use strict";


const registrar = (function() {
    let generateUUID;

    generateUUID = () => {
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' &&
            typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    return {
        Registrar: function() {
            this.elements = new Map();
            this.register = function(options) {
                if (typeof options === 'object' && 
			typeof(options.uuid) !== "undefined" &&
			typeof(options.value) !== "undefined"){

                    this.elements.set(options.uuid, options.value); 
                    return options.uuid
                }
                let newUUID = generateUUID();
                this.elements.set(newUUID, options);
                return newUUID;
            }
        }, 
	errors: {
		nonRegisteredElement: "Element is not registered"
	}, 
	Exception:function(err){

	}
    }
})()

/******************************************************************************
 * Registrar objects
 * -----------------
 *  data structure that holds and registers elements, 
 *  keeping track of their status
 * 
 * ***************************************************************************/
registrar.Registrar.prototype = {

    /*****************************************************************
     *  Registers an event in the registrar
     *  *************************************************************/

    get size() {
        return this.elements.size;
    },

    flush: function(ev) {
        this.elements.clear();
    },

    forEach: function(eventCallbackFunction) {
        this.elements.forEach(eventCallbackFunction);
    },

    get: function(objID) {
        return this.elements.get(objID);
    },

    filter: function(filterPred) {
        /********************************************************
         * returns an array of elements filtered as 
         * per the predicate argument
         * *****************************************************/
        let arrayRes = [];
        this.elements.forEach((value, key) => {
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
        if (!this.elements.has(evId)) {
            throw new registrar.Exception(registrar.errors.nonRegisteredElement)
        }
        this.elements.delete(evId);
    }


};

module.exports = {
    registrar
}
