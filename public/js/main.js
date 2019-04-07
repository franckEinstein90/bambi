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
AJS.toInit(function($) {
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
                    newRow += "<td ID='" + dayID + "' class='" + ((dayID.localeCompare(dateUtils.dayStamp()) == 0) ? "day" : "today") + "'>";
                    newRow += dayCounter++;
                    var eventOnThatDay = eventUtils.eventsAt(dayID);
                    if (eventOnThatDay.length > 0) {
                        newRow += "<span style='color:red'><a id='" +
                            dayID + "' title='" +
                            eventOnThatDay.map(ev => ev.eventTitle).join(",") + "'> &nbsp;" +
                            eventOnThatDay.length + " event(s)</a></span>";
                    }
                    newRow += "</td>";
                } else {
                    newRow += "<td class='day'></td>";
                }
            }
            newRow += "</tr>";
            $("#tableBody").append(newRow);
            for (let i = 0; i < addedDays.length; i++) {
                $("#" + addedDays[i]).click(function() {
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
    fillYears();

    $("#dateChooser").change(function() {
        let theMonth = document.dateChooser.chooseMonth.selectedIndex;
        let theYear = parseInt(document.dateChooser.chooseYear.options[document.dateChooser.chooseYear.selectedIndex].text);
        calendarSettings.setValues(
            parseInt(document.dateChooser.chooseYear.options[document.dateChooser.chooseYear.selectedIndex].text),
            document.dateChooser.chooseMonth.selectedIndex);
        populateTable(theMonth, theYear);
    });

    let theMonth = document.dateChooser.chooseMonth.selectedIndex;
    let theYear = parseInt(document.dateChooser.chooseYear.options[document.dateChooser.chooseYear.selectedIndex].text);
    populateTable(theMonth, theYear);

});
