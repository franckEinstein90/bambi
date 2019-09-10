"use strict"; 
/********************************************************
 * client/confluencePage.js
 * Handles environment when env is a confluence page
 *******************************************************/
const bambi = require('../bambi.js').bambi;
const calendarEvents = require('../events/calendarEvents.js').calendarEvents
const events = require('../events/events.js').events

const confluencePage = (function() {
    let _pageID, _path, _title, _version, _content, setValues,
    fieldSeparator, updateMatchers, 
    calendarVersionInfoReg, 
    eventDescriptionMatcher, infoType,
    toDate,
    parse, tryParseJSON,  makeEventFromStringValues;
    
    _path = ""
    _title = ""
    _version = undefined
    _content = ""

    setValues = function() {
        _path = contextPath + "/rest/api/content/" + _pageID;
        let result = jQuery.getValues(_path + "?expand=body.storage,version");
        _title = result["title"];
        _version = result["version"]["number"];
        _content = result["body"]["storage"]["value"];
    }

    toDate = (dayStamp) => { 
        let [year, month, day] = dayStamp.split("-");
        return new Date(year, month - 1, day);
    }
    calendarVersionInfoReg = /Parks Canada Confluence Calendar - v\d\.\d/
    fieldSeparator = bambi.htmlFieldSeparator();

    tryParseJSON = function(jsonString){
        try {
         var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (o && typeof o === "object") {
                return o;
            }
        }
        catch (e) { }
            return false;
     },
    
    infoType = {
        JSONEvent: 10, 
        STRINGEvent: 11
    },

    parse = (evStr) => {
            let recognized, obj; 
            obj = tryParseJSON(evStr)
            if(obj) {
                return {type: infoType.JSONEvent, value:obj}
            }
            recognized = evStr.match(calendarVersionInfoReg)
            if(recognized){//version information
                    let [, vInfo] = recognized
                    bambi.prevVersion = vInfo
                    return;  
            }
            recognized = evStr.match(eventDescriptionMatcher);
            if (recognized) {
                let [, beginDate, endDate, description] = recognized;
                return {
                    type: infoType.STRINGEvent,
                    value:{
                        beginDate,
                        endDate,
                        description
                    }
                }
            }
    }
    makeEventFromStringValues = (evFieldValues) => {
        let beginDate, endDate, description 
        beginDate = toDate(evFieldValues.beginDate)
        endDate = toDate(evFieldValues.endDate)
        description = evFieldValues.description.split(new RegExp(fieldSeparator)).filter(x => x.length > 1)

            try {
                return new calendarEvents.CalendarEvent(
                    beginDate,
                    endDate,
                    description[0].trim(),
                    description[1])
            } catch (e) {
                throw e + " at eventDecoder.makeEventObject";
            }
    }

    return { 
         onReady: function(pageID) {
             if(!bambi.isDev()) { //we're in a confluence page environment
                _pageID = confEnv.pageID;
                setValues();
            } 
            confluencePage.updateMatchers()
        },
        pageID: function() {
            return _pageID;
        },
        path: function() {
            return _path;
        },
        title: function() {
            return _title;
        },
        version: function() {
            return _version;
        },
        content: function() {
            return _content;
        },
       updateMatchers : function(){ //used to extract information stored directly on a confluence page
            eventDescriptionMatcher = new RegExp(`Event from (\\d{4}\\-\\d{2}\\-\\d{2}) to (\\d{4}\\-\\d{2}\\-\\d{2})\\s*${fieldSeparator}\\s*(.+)`)
        },
        /********************************************************************
         * given a string describing a calendar event, verify it for format
         *  and content, and if an event can be made of it, create it, id it,
         *  and  register it with eventUtils manager
         ********************************************************************/
        processCalendarInformation: (calendar, eventDescriptionString) => {
            let infoDescription = parse(eventDescriptionString);
            if(!infoDescription){
                return
            }
            if(infoDescription.type === infoType.JSONEvent){
                    let newCalendarEvent
                    try{
                        newCalendarEvent = new calendarEvents.CalendarEvent(
                            infoDescription.value.timeSpan.beginDate,
                            infoDescription.value.timeSpan.endDate,
                            infoDescription.value.eventTitle,
                            infoDescription.value.eventDescription
                        )
                        calendar.register(newCalendarEvent)
                        return; 
                    }
                    catch(e){
                        console.log("unable to create new calendar event from JSON description at processCalendarInformation" + e)
                    }
            }
            if(infoDescription.type === infoType.STRINGEvent){
                calendar.register(makeEventFromStringValues(infoDescription.value))
                return; 
            }
        }
    }
})()

module.exports = {
    confluencePage
}
