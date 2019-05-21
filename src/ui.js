/******************************************************************************
 * ui.js 
 * FranckEinstein90
 * --------------------------
 *  contains all related to ui
 * ***************************************************************************/

/****************************************************
 * Module pageContainer
 * ---------------------
 *  All related to the page that contains the various uis
 ***************************************************/
const pageContainer = (function() {

})();

/****************************************************
 * Module eventDialogController
 ***************************************************/
 const eventDialogController = (function() {
    let dialogAction = undefined,
    eventBeginDateField = "#event-dialog-begin-date",
    eventEndDateField = "#event-dialog-end-date",
    dateStampToDate = function(dayStamp){
    dateUtils.setSeparator("-");
    return dateUtils.dayStampToDate(dayStamp)
   },
   calendarBlankEvent = function(dayStamp){
     let beginDate = dateStampToDate(dayStamp);
     return new eventUtils.Event(beginDate, beginDate, "", "");
   },
   setEventFormValues = function(ev) {
       dateUtils.setSeparator('-');
       AJS.$(eventBeginDateField).val(dateUtils.dateToDayStamp(ev.beginDate));
       AJS.$(eventEndDateField).val(dateUtils.dateToDayStamp(ev.endDate));
       if(ev.eventTitle){
         AJS.$("#event-dialog-title").val(ev.eventTitle);
       }
       if(ev.eventDescription){
        AJS.$("#event-dialog-description").val(ev.eventDescription);
       }
   },
   setEventDialogHeader = function(headerTitle){
       AJS.$("#event-dialog-action").text(headerTitle);
   },
   validateFormInfo = function(){
     let fieldAsDate = function(fieldID){
       return dateUtils.dayStampToDate(AJS.$(fieldID).val());
     },
     beginDate = fieldAsDate(eventBeginDateField),
     endDate = fieldAsDate(eventEndDateField);
     console.log("validating");
   }
     return {

      dialogActions : {create: 1, edit: 2},

      getDialogAction: function(){
           return dialogAction;
         },

      showEdit: function(evID) {
           dialogAction = eventDialogController.dialogActions.edit;
           setEventDialogHeader("Modifying existing event");
           let ev = eventUtils.get(evID);
           setEventFormValues(ev);
           AJS.dialog2("#event-dialog").show();
         },

      showNew: function(dayStamp) {
           dialogAction = eventDialogController.dialogActions.create;
           setEventDialogHeader("Creating new event");
           let ev = calendarBlankEvent(dayStamp);
           setEventFormValues(ev);
           AJS.dialog2("#event-dialog").show();
         },

      publish: function(ev){
           console.log("publishing event to page" + ev.eventTitle);
           validateFormInfo();
         }
     }
 })();



const calendarUI = (function(){
    let calendarTableTitle, 
    tag = (t, content, id) => `<${t}> ${content} </${t}>`, 
   setCalendarTitle = function(){
            calendarTableTitle =
                dateUtils.monthIdxToStr(calendarSettings.month) +
                " " + calendarSettings.year
            AJS.$("#tableCalendar-title").html("<h1 style='color:white'>" +
                calendarTableTitle + "</h1>");
    },

    addTableCells = function(weekRow){
       let dayID = function(dayDate) {
             return dateUtils.dayStamp( 
                        calendarSettings.year, 
                        calendarSettings.month, 
                        dayDate)
        };
       return weekRow.map(x => tag('td', dayID(x))).join(); 
    },  

    addTableBody = function(){
        let firstWeekday = calendarSettings.firstDay(),
        currentDay = 1, 
        lastMonthDay = calendarSettings.monthLength, 
        weekRow = [0, 1, 2, 3, 4, 5, 6], 
        rows = [], 
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
