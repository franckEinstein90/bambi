/*****************************************************************************/

/*****************************************************************************/

var makeEventView = function(index, bDate, eDate, evBody) {
    let makeDiv = (divBody, divClass, divId) => `<div class='${divClass}' id='${divID}'>${divBody}</div>`,
        re = /(.+)\s*\:(.+)/,
        eventTitle = evBody,
        eventDescription,
        found = evBody.match(re),
        addControlIcon = function(iconName, id) {
            return "<span class='aui-icon aui-icon-small " +
                iconName +
                " event-edit-btn' id='" + id +
                "Edit'>Insert meaningful text here for accessibility</span>";
        };

    if (found) { //the event also contains a long description
        eventTitle = found[1];
        eventDescription = found[2];
    }
    let evID = eventUtils.processDateRange(bDate, eDate, eventTitle, eventDescription);
    let htmlStr = "<div class='hidden'>" + evID + "</div>" +
        "<div class='eventHeaderRow'><div class='eventTitle'>" + eventTitle + "</div>" +
        "<div class='event-controls'>" +
        "<span class='aui-icon aui-icon-small aui-iconfont-edit event-edit-btn' id='" + evID + "Edit'>Insert meaningful text here for accessibility</span>" +
        "<span class='aui-icon aui-icon-small aui-iconfont-delete event-edit-btn'>Insert meaningful text here for accessibility</span>" +
        "</div></div>" + "<div class='event-dates'>" + bDate;

    if (bDate.localeCompare(eDate) != 0) {
        htmlStr += " to " + eDate
    }
    htmlStr += "</div>";
    if (typeof(eventDescription) !== "undefined") {
        htmlStr += "<div id='event" + index + "' class='aui-expander-content'>";
        htmlStr += eventDescription;
        htmlStr += "</div><a id='replace-text-trigger' data-replace-text='Read less' class='aui-expander-trigger' aria-controls='event" + index + "'>Read more</a></br>";
    }
    return {
        html: "<div class='eventView'>" + htmlStr + "</div>",
        id: evID
    };
};

AJS.toInit(function($) {
    /********************************************************************/
    /* given a string describing a calendar event as printed on the pageManager,
    /* register it with eventUtils manager
    /********************************************************************/
    let registerEventOnPage = function(evFields) {
        let regDateRange = /Event from (\d{4}\-\d{2}\-\d{2}) to (\d{4}\-\d{2}\-\d{2})/;
        if (evFields.length > 1) {
            //Gather event data
            let matchDates = evFields[0].match(regDateRange);
            if (matchDates) {
                let strEventBeginDate = matchDates[1],
                    strEventEndDate = matchDates[2],
                    strEventShortTitle = evFields[1],
                    strEventDescription = (evFields.length > 2) ? evFields[2] : "";
                eventUtils.processDateRange(strEventBeginDate, strEventEndDate, strEventShortTitle, strEventDescription);
            }
        }
    }


    let pageManager = (function() {
        let makeDiv = (divBody, divId, divClass) => `<div class='${divClass}' id='${divId}'>${divBody}</div>`,
            makeSpan = (spanBody, spanId, spanClass) => `<span class='${spanClass}' id = '${spanId}'>${spanBody}</span>`;
            dateUtils.setSeparator("-");

        AJS.$("h1:contains('Events') + ul li").each(function(index) { //Extract event descriptions from the page, and register them
            let evDescription = AJS.$(this).text(),
                evFields = evDescription.split(/\s*\:\s*/);
            registerEventOnPage(evFields);
        });
        return {
            makeEventViewPanel: function() {
                //insert the event view panel in the DOM
                AJS.$("h1:contains('Events')").before(makeDiv("", "eventList", "event-list"));
                //create a card for each event
                eventUtils.forEach(pageManager.makeEventViewCard);
                //hide the unformatted event list from the page
                AJS.$("h1:contains('Events') + ul").remove();
                AJS.$("h1:contains('Events')").remove();
            },
            makeEventViewCard: function(ev) {
                let cardContent = makeDiv(ev.id, "", "hidden") + pageManager.makeEventHeaderRow(ev) + pageManager.makeEventDatesRow(ev);
                AJS.$("#eventList").append(makeDiv(cardContent, "", "event-view"));
            },
            makeEventHeaderRow: function(ev) {
              let makeIconButton = (accessText, id, buttonName) => makeSpan(accessText, id, 'aui-icon aui-icon-small event-edit-button aui-iconfont-' + buttonName),
                  editButton = makeIconButton ("edit event", ev.id, "edit");
                return makeDiv(makeDiv(ev.eventTitle, "", "event-title") + makeDiv(editButton, "", "event-controls"));
            },
            makeEventDatesRow: function(ev) {
                let dateInfo = dateUtils.dateToDayStamp(ev.beginDate),
                    endDate = dateUtils.dateToDayStamp(ev.endDate);
                if (dateInfo !== endDate) {
                    dateInfo = dateInfo + " to " + endDate
                }
                return makeDiv(dateInfo, "", "event-dates");
            }
        };
    })();

    eventUtils.logEvents();
    let setEventFormValues = function(evID) {
        let ev = eventUtils.get(evID);
        dateUtils.setSeparator('-');
        AJS.$("#event-dialog-begin-date").val(dateUtils.dateToDayStamp(ev.beginDate));
        AJS.$("#event-dialog-end-date").val(dateUtils.dateToDayStamp(ev.endDate));
        AJS.$("#event-dialog-title").val(ev.eventTitle);
        AJS.$("#event-dialog-description").val(ev.eventDescription);
    };

    /**************************Page setup General ********/
    /*****************************************************/
    //hidding event ids
    AJS.$('.hidden').hide();

    const eventDialogController = (function() {
        return {
            setParams: function(dayStamp, cp) {
                var dayStampISO8601 = dayStamp.replace(/\_/g, "-");
                $("#dateEnd").val(dayStampISO8601);
                $("#begin-date").val(dayStampISO8601);
            },
            showEdit: function(evID) {
                AJS.$("#event-id").text(evID);
                let ev = eventUtils.get(evID);
                setEventFormValues(evID);
                AJS.dialog2("#event-dialog").show();
            },
            showNew: function() {}
        }
    })();

    //Set the calendarSetting object to today's date
    calendarSettings.setValues();

    /**************************************************************/
    /*Event Listing UI                       **********************/
    /***********************                                      */


    pageManager.makeEventViewPanel();
   AJS.$("#dialog-show-button").click(function(e) {
        e.preventDefault();
        AJS.dialog2("#event-dialog").show();
    });

    AJS.$("#dialog-submit-button").click(function(e) {
        e.preventDefault();
        AJS.dialog2("#demo-dialog").hide();
    });

    AJS.$("#select-previous-month").click(function(e) {
        calendarSettings.previousMonth();
        setFormValues();
        populateCalendarTable();
    });

    AJS.$("#select-next-month").click(function(e) {
        calendarSettings.nextMonth();
        setFormValues();
        populateCalendarTable();
    });

    AJS.$("#dateChooser").change(function() {
        getFormValues();
    });

    //furnction  to capture variables from get request
    jQuery.extend({
        getValues: function(url) {
            var result = null;
            jQuery.ajax({
                url: url,
                type: 'get',
                async: false,
                success: function(data) {
                    result = data;
                }
            });
            return result;
        }
    });



    var formatUIEvent = function(ev) {
        return "<a data-aui-trigger aria-controls='more-details' href='#more-details'>" + ev.eventTitle +
            "</a><aui-inline-dialog id='more-details'>" +
            "<P>Lorem ipsum</P></aui-inline-dialog>"
    }

   //function called when user clicks on a day
    function showDayDialog(dayID) {
        eventDialog.setParams(dayID);
        eventDialog.show();
    }

    let populateFormOptions = function() {
        let makeOption = (idx, value) => `<option value="${idx}">${value}</option>`;
        let yearChooser = document.dateChooser.chooseYear;
        for (i = calendarSettings.beginYear(); i < calendarSettings.endYear(); i++) {
            yearChooser.options[yearChooser.options.length] = new Option(i, i)
        }
        appData['monthsEn'].forEach((month, idx) => AJS.$("#chooseMonth").append(makeOption(idx, month)));
        setFormValues();
    }

    let setFormValues = function() { //updates the form values based on the calendarSettings values
        document.dateChooser.chooseMonth.selectedIndex = calendarSettings.month;
        let yearIDX = calendarSettings.yearIdx();
        document.dateChooser.chooseYear.selectedIndex = yearIDX;
    }

    let getFormValues = function() { //updates the calendarSettings values based on the form values
        calendarSettings.setValues(
            parseInt(document.dateChooser.chooseYear.options[document.dateChooser.chooseYear.selectedIndex].text),
            document.dateChooser.chooseMonth.selectedIndex);
        calendarUI.populateCalendarTable();
    }

    populateFormOptions();
    getFormValues();

});
