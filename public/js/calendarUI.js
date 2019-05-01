/******************************************************************************
 * title
 * FranckEinstein90
 * ***************************************************************************/


const calendarUI = (function(){
    let calendarTableTitle, 
    
    tag = ((t, content) => `<${t}> ${content} </${t}>`), 
    setCalendarTitle = function(){
            calendarTableTitle = 
                dateUtils.monthIdxToStr(calendarSettings.month) + 
                " " + calendarSettings.year
            AJS.$("#tableCalendar-title").html("<h1 style='color:white'>" + 
                calendarTableTitle + "</h1>");
    },

    addTableCells = function(weekRow){
       return weekRow.map(x => tag('td', x)).join(); 

    },  
    addTableBody = function(){

        let firstWeekday = calendarSettings.firstDay(); 
        let currentDay = 1, 
        lastMonthDay = calendarSettings.monthLength, 

        weekRow = [0, 1, 2, 3, 4, 5, 6], 
        rows = [], 
        addRow = function(){
            if(rows.length === 0){
                rows.push(weekRow.map(
                    x =>  x >= firstWeekday ? currentDay++ : "--"));
            }
            else {
                rows.push(weekRow.map(
                    x => currentDay <= lastMonthDay? currentDay++ : "--"));
            }
        };
        while (currentDay <= lastMonthDay){
            addRow();
        }
        AJS.$("#tableBody").empty();
        rows.forEach(x => 
            AJS.$("#tableBody").append(`<tr>${addTableCells(x)}</tr>`));
    }
    return{
      populateCalendarTable : function() {
            let dayCounter = 1; 
            let weekday1st = calendarSettings.firstDayOfMonth;
            setCalendarTitle();
            addTableBody();

       /*AJS.$("#tableBody").empty();
        while (dayCounter <= calendarSettings.monthLength) {
            let newRow = "",
                addedDays = [];
            for (let i = 0; i < 7 && dayCounter <= calendarSettings.monthLength; i++) {
                if ((AJS.$("#tableBody tr").length >= 1) || (i >= weekday1st)) {
                    let dayID = dateUtils.dayStamp(calendarSettings.year, calendarSettings.month, dayCounter),
                        eventsOnThatDay = eventUtils.eventsOn(dayID);

                    addedDays.push(dayID);
                    newRow += "<td ID='" + dayID + "' class='" + ((dayID.localeCompare(dateUtils.dayStamp()) == 0) ? "today" : "day") + "'>";
                    newRow += "<div ID='digit" + dayID + "' class='date'>" + dayCounter + "</div>";
                    dayCounter++;
                    if (eventsOnThatDay.length > 0) {
                        newRow += "<div class='dayEvents'>";
                        newRow += eventsOnThatDay.map(formatUIEvent).join("<br/>");
                        newRow += "</div>";
                    }
                    newRow += "</td>";
                } else {
                    newRow += "<td class='day'></td>";
                }
            }
            AJS.$("#tableBody").append(`<tr>${newRow}</tr>`);
            for (let i = 0; i < addedDays.length; i++) {
                $("#digit" + addedDays[i]).click(function() {
                    showDayDialog(addedDays[i]);
                });
            }
        }*/
    }
    };
})();
