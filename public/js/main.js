
var makeEventView = function(index, bDate, eDate, evBody) {
    let re = /(.+)\s*\:(.+)/,
        eventTitle = evBody,
        eventDescription,
        found = evBody.match(re);
    if (found) { //the event also contains a long description
        eventTitle = found[1];
        eventDescription = found[2];
    }
    evID = eventUtils.processDateRange(bDate, eDate, eventTitle, eventDescription);
    let htmlStr = "<div class='eventView'><div class='hidden'>" + evID + "</div>" +
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
        html: htmlStr + "</div>",
        id: evID
    };
};

AJS.toInit(function($) {


  /**************************Page setup General ********/
  /*****************************************************/
  //hidding event ids
  AJS.$('.hidden').hide();

  var eventDialogController = (function(){
    return{
          setParams: function(dayStamp, cp){
            var dayStampISO8601 = dayStamp.replace(/\_/g, "-");
            $("#dateEnd").val(dayStampISO8601 );
            $("#begin-date").val(dayStampISO8601);
          },
          showEdit: function(evID){
            AJS.$("#event-id").text(evID);
            AJS.dialog2("#demo-dialog").show();
          },
          showNew: function(){
          }
        }
      })();

    //Set the calendarSetting object to today's date
    calendarSettings.setValues();

    /**************************************************************/
    /*Event Listing UI*********************************************/
    $("h1:contains('Events')").before("<div id='eventlist' class='eventList'></div>");
    let re = /Event from (\d{4}\-\d{2}\-\d{2}) to (\d{4}\-\d{2}\-\d{2})\:\s(.+)/;
    dateUtils.setSeparator("-");
    $("h1:contains('Events') + ul li").each(function(index) {
        let found = ($(this).text()).match(re);
        if (found) {
            let res = makeEventView(index, found[1], found[2], found[3]);
            $("#eventlist").append(res.html);
            $("#" + evID + "Edit").click(function() {
                eventDialogController.showEdit(res.id);
            });
        }
    });

    $("h1:contains('Events') + ul").remove();
    $("h1:contains('Events')").remove();


    //    $("h1:contains('Events'), h1:contains('Events') + ul").appendTo("#eventlist");

    // Shows the dialog when the "Show dialog" button is clicked
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
        return "<a data-aui-trigger aria-controls='more-details' href='#more-details'>" + ev.eventTitle  +
            "</a><aui-inline-dialog id='more-details'>" +
            "<P>Lorem ipsum</P></aui-inline-dialog>"
    }

    var populateCalendarTable = function(){

        // initialize date-dependent variables
        let firstDay = calendarSettings.firstDayOfMonth;
        let howMany = calendarSettings.monthLength;
        $("#tableHeader").html(`<h1>${dateUtils.monthIdxToStr(calendarSettings.month)} ${calendarSettings.year}</h1>`);

        // initialize vars for table creation
        let dayCounter = 1;
        $("#tableBody").html("");
        while (dayCounter <= howMany) {
            let newRow = "<TR>";
            let addedDays = [];
            for (let i = 0; i < 7; i++) {
                if (dayCounter > howMany) {
                    break;
                }
                if (($("#tableBody tr").length >= 1) || (i >= firstDay)) {
                    let dayID = dateUtils.dayStamp(calendarSettings.year, calendarSettings.month, dayCounter);
                    addedDays.push(dayID);
                    newRow += "<td ID='" + dayID + "' class='" + ((dayID.localeCompare(dateUtils.dayStamp()) == 0) ? "today" : "day") + "'>";
                    newRow += "<div ID='digit" + dayID + "' class='date'>" + dayCounter + "</div>";
                    dayCounter++;
                    var eventOnThatDay = eventUtils.eventsAt(dayID);
                    if (eventOnThatDay.length > 0) {
                        newRow += "<div class='dayEvents'>";
                        newRow += eventOnThatDay.map(formatUIEvent).join("<br/>");
                        newRow += "</div>";
                    }
                    newRow += "</td>";
                } else {
                    newRow += "<td class='day'></td>";
                }
            }
            newRow += "</tr>";
            $("#tableBody").append(newRow);
            for (let i = 0; i < addedDays.length; i++) {
                $("#digit" + addedDays[i]).click(function() {
                    showDayDialog(addedDays[i]);
                });
            }
        }
    }
    //function called when user clicks on a day
    function showDayDialog(dayID) {
        eventDialog.setParams(dayID);
        eventDialog.show();
    }

    function fillYears() {
        var yearChooser = document.dateChooser.chooseYear;
        for (i = calendarSettings.beginYear(); i < calendarSettings.endYear(); i++) {
            yearChooser.options[yearChooser.options.length] = new Option(i, i)
        }
        setFormValues();
    }

    var setFormValues = function() { //updates the form values based on the calendarSettings values
      document.dateChooser.chooseMonth.selectedIndex = calendarSettings.month;
      let yearIDX =calendarSettings.yearIdx();
      document.dateChooser.chooseYear.selectedIndex = yearIDX;
    }

    var getFormValues = function() { //updates the calendarSettings values based on the form values
      calendarSettings.setValues(
            parseInt(document.dateChooser.chooseYear.options[document.dateChooser.chooseYear.selectedIndex].text),
            document.dateChooser.chooseMonth.selectedIndex);
        populateCalendarTable();
    }

    fillYears();

    getFormValues();

});
