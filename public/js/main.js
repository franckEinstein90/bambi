var calendarSettings = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    firstDayOfMonth: dateUtils.firstDayOfMonth(this.year, this.month),
    monthLength: dateUtils.monthLength(this.year, this.month),
    setValues: function(year, month) {
        this.month = month;
        this.year = year;
        this.firstDayOfMonth = dateUtils.firstDayOfMonth(this.year, this.month);
        this.monthLength = dateUtils.monthLength(this.year, this.month);
    }
};
var makeEventView = function(index, bDate, eDate, evBody){
     let re = /(.+)\s*\:(.+)/,
     eventTitle = evBody,
     eventDescription;
     let found = evBody.match(re);
     if (found){
       eventTitle = found[1];
       eventDescription = found[2];
     }
	   evID = eventUtils.processDateRange(bDate, eDate, eventTitle, eventDescription);
	   let returnStr =  "<div class='eventView'><div class='hidden'>" + evID + "</div>" +
            "<span class='eventTitle'>" + eventTitle + "</span>" +
  		      "<div class='event-controls'>" +
            "<span class='aui-icon aui-icon-small aui-iconfont-edit event-edit-btn'>Insert meaningful text here for accessibility</span>"+
            "<span class='aui-icon aui-icon-small aui-iconfont-delete event-edit-btn'>Insert meaningful text here for accessibility</span>"+
            "</div>" + "<div class='event-dates'>" + bDate;
      if(bDate.localeCompare(eDate) != 0) {
        returnStr +=" to " + eDate
      }
      returnStr +=  "</div>";
      if(typeof(eventDescription) !== "undefined"){
        returnStr += "<div id='event" + index + "' class='aui-expander-content'>";
        returnStr += eventDescription;
		    returnStr += "</div><a id='replace-text-trigger' data-replace-text='Read less' class='aui-expander-trigger' aria-controls='event" + index + "'>Read more</a></br>";
      }
      return returnStr + "</div>";
};


AJS.toInit(function($) {
    //Get the events that are embedded onto the page
    $("h1:contains('Events')").before("<div id='eventlist' class='eventList'></div>");
    let re = /Event from (\d{4}\-\d{2}\-\d{2}) to (\d{4}\-\d{2}\-\d{2})\:\s(.+)/;
    dateUtils.setSeparator("-");
    $("h1:contains('Events') + ul li").each(function (index){
	  let found = ($(this).text()).match(re);
	if(found){
     $("#eventlist").append(makeEventView(index, found[1], found[2], found[3]));
	}
    });

  //hidding event ids
  AJS.$('.hidden').hide();


//    $("h1:contains('Events'), h1:contains('Events') + ul").appendTo("#eventlist");

// Shows the dialog when the "Show dialog" button is clicked
    AJS.$("#dialog-show-button").click(function(e) {
        e.preventDefault();
        AJS.dialog2("#demo-dialog").show();
    });

    AJS.$("#dialog-submit-button").click(function(e) {
        e.preventDefault();
        AJS.dialog2("#demo-dialog").hide();
    });

    AJS.$("#select-previous-month").click(function(e) {});

    AJS.$("#select-next-month").click(function(e) {});
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



var formatUIEvent = function(ev){
    return "<a data-aui-trigger aria-controls='more-details' href='#more-details'>" + ev.eventTitle.substring(0,5) + "..." +
		"</a><aui-inline-dialog id='more-details'>" +
		"<P>Lorem ipsum</P></aui-inline-dialog>"
}

    function populateTable(theMonth, theYear) {

        // initialize date-dependent variables
        let firstDay = calendarSettings.firstDayOfMonth;
        let howMany = dateUtils.monthLength(theYear, theMonth);
        $("#tableHeader").html(`<h1>${dateUtils.monthIdxToStr(theMonth)} ${theYear}</h1>`);

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
                    let dayID = dateUtils.dayStamp(theYear, theMonth, dayCounter);
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
        var today = new Date();
        var thisYear = today.getFullYear();
        var yearChooser = document.dateChooser.chooseYear;
        for (i = thisYear; i < thisYear + 5; i++) {
            yearChooser.options[yearChooser.options.length] = new Option(i, i)
        }
        setCurrMonth(today)
    }

    function setCurrMonth(today) {
        document.dateChooser.chooseMonth.selectedIndex = today.getMonth()
    }

    function highLightEventsInCalendar() {
        let todayDate = Date.now();
        console.log(
            todayDate.getDate().toString().padStart(2, '0'));
        $("#2019-03-15").css("color", "red");
    }
    var getFormValues= function(){
 let theMonth = document.dateChooser.chooseMonth.selectedIndex;
        let theYear = parseInt(document.dateChooser.chooseYear.options[document.dateChooser.chooseYear.selectedIndex].text);
        calendarSettings.setValues(
            parseInt(document.dateChooser.chooseYear.options[document.dateChooser.chooseYear.selectedIndex].text),
            document.dateChooser.chooseMonth.selectedIndex);
        populateTable(theMonth, theYear);

    }

  fillYears();
  $("#dateChooser").change(function() { getFormValues();});
  getFormValues();

});
