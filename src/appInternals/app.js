
"use strict"

const winston = require('winston')
/*********************** ******************************************************/
const appData   = require('@appInternals/appData').appData
const appClock  = require('@appInternals/appClock').appClock
/*********************** code from this rep (in src) **************************/
const ready = function(){

    let _setAppClock    = () => appClock.start()
    let _appLogger      = winston.createLogger({
        level:'info',  
        format: winston.format.simple(), 
        transports: [
            new winston.transports.Console()
        ]
    })
    _appLogger.info('bambi init start')
     

    return{
        say: x => _appLogger.info(x),
        run: () => {
            _appLogger.info('bambi booting')
            _setAppClock() 
        }
    }
}


module.exports = {
    ready
}
