"use strict";
/**********************************************
 * pageParser.js
 * Extracts event information stored on the page
 *********************************************/
const bambi = require('../bambi').bambi
const calendarEvents = require('../events/calendarEvents').calendarEvents
const eventCategories = require('../events/eventCategories').eventCategories

const pageParser = (function() {
    let infoType, //codes for the type of information described
        fieldSeparator, updateMatchers,
        calendarVersionInfoReg,
        eventDescriptionMatcher,
        toDate,
        parse, tryParseJSON, parseFromObject,
        //events
        registerEventFromStringDescription, registerEventFromJSONDescription,
        //categories
        createCategoryFromJSONDescription

    toDate = (dayStamp) => {
        let [year, month, day] = dayStamp.split("-");
        return new Date(year, month - 1, day);
    }

    calendarVersionInfoReg = /Parks Canada Confluence Calendar - v\d\.\d/

    fieldSeparator = bambi.htmlFieldSeparator()

    tryParseJSON = function(jsonString) { //Description in JSON format
            try {
                var o = JSON.parse(jsonString);
                if (o && typeof o === "object") {
                    return o;
                }
            } catch (e) {}
            return false;
        },

        infoType = {
            JSONCategoryDescription: 10,
            JSONEvent: 20,
            STRINGEvent: 30
        }

        parseFromObject = function(infoObj) {
            if ('infoType' in infoObj) {
                switch (infoObj.infoType) {
                    case infoType.JSONCategoryDescription:
                        return {
                            type: infoType.JSONCategoryDescription,
                            value: infoObj
                        }
                        break;
                }
            }
            return {
                type: infoType.JSONEvent,
                value: infoObj
            }
        }

        parse = (evStr) => {
            let recognized, obj;
            //is this a JSON description? 
            obj = tryParseJSON(evStr)
            if (obj) {
                return parseFromObject(obj)
            }

            //string ad-hoc description
            recognized = evStr.match(calendarVersionInfoReg)
            if (recognized) { //version information
                let [, vInfo] = recognized
                bambi.prevVersion = vInfo
                return;
            }
            recognized = evStr.match(eventDescriptionMatcher);
            if (recognized) {
                let [, beginDate, endDate, description] = recognized;
                return {
                    type: infoType.STRINGEvent,
                    value: {
                        beginDate,
                        endDate,
                        description
                    }
                }
            }
        }

    registerEventFromStringDescription = function(calendar, evFieldValues) {
        let beginDate, endDate, description
        beginDate = toDate(evFieldValues.beginDate)
        endDate = toDate(evFieldValues.endDate)
        description = evFieldValues.description.split(new RegExp(fieldSeparator)).filter(x => x.length > 1)

        try {
            calendar.register(
                new calendarEvents.CalendarEvent(
                    beginDate,
                    endDate,
                    description[0].trim(),
                    description[1])
            )

        } catch (e) {
            throw e + " at eventDecoder.makeEventObject";
        }
    }

    registerEventFromJSONDescription = function(calendar, evDescription) {
        let newCalendarEvent
        try {
            newCalendarEvent = calendarEvents.newCalendarEvent({
                beginDate: evDescription.timeSpan.beginDate,
                endDate: evDescription.timeSpan.endDate,
                title: evDescription.eventTitle,
                description: evDescription.eventDescription,
                categoryID: evDescription.categoryID || 0
            })
            calendar.register(newCalendarEvent)
        } catch (err) {
            console.log("unable to create new calendar event from JSON description at processCalendarInformation" + e)
        }
    }

    createCategoryFromJSONDescription = function(categoryDescription) {
        eventCategories.addCategory(categoryDescription)
    }

    return {
        onReady: function() {
            pageParser.updateMatchers()
        },

        updateMatchers: function() { //used to extract information stored directly on a confluence page
            eventDescriptionMatcher = new RegExp(`Event from (\\d{4}\\-\\d{2}\\-\\d{2}) to (\\d{4}\\-\\d{2}\\-\\d{2})\\s*${fieldSeparator}\\s*(.+)`)
        },

        /********************************************************************
         * given a string describing a calendar event, setting, or category, 
         * a) verify it for format and content, 
         * b) process accordingly 
         ********************************************************************/
        processCalendarInformation: (calendar, eventDescriptionString) => {
            let infoDescription = parse(eventDescriptionString);
            if (!infoDescription) {
                return
            }
            switch (infoDescription.type) {
                case (infoType.JSONEvent):
                    registerEventFromJSONDescription(calendar, infoDescription.value)
                    break
                case (infoType.StringEvent):
                    registerEventFromStringDescription(calendar, infoDescription.value)
                    break
                case (infoType.JSONCategoryDescription):
                    createCategoryFromJSONDescription(infoDescription.value)
                    break
            }
        }

    }
})()

module.exports = {
    pageParser
}
