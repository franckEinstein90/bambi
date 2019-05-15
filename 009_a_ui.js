jQuery.extend({
       getValues:function(url){
         var result=null;
         jQuery.ajax({
           url:url,
           type: 'get',
           async:false,
           success: function(data){
             result=data;
           }
         });
         return result;
       }
   });

//gets the current page's information
const currentPage =  {
          pageID : $content.getIdAsString(),
          setValues: function(){
            this.path = contextPath + "/rest/api/content/" + this.pageID;
            this.result = jQuery.getValues(this.path + "?expand=body.storage,version");
            this.pageTitle = this.result["title"];
            this.versionNumber = this.result["version"]["number"];
            this.pageBody = this.result["body"]["storage"]["value"];
          }
        };

currentPage.setValues();
    dateUtils.setSeparator("-");

        let found = ($(this).text()).match(re);
        if (found) {
            let eventViewPanel = eventsUI.makeEventView(index, found[1], found[2], found[3]);
            AJS.$("#eventlist").append(eventViewPanel.html);
            AJS.$("#" + eventViewPanel.id + "Edit").click(function() {
                eventDialogController.showEdit(eventViewPanel.id);
            });
        }
    });


const pageContainer = (function(){

  let evRegExp = /Event from (\d{4}\-\d{2}\-\d{2}) to (\d{4}\-\d{2}\-\d{2})\:\s(.+)/, 
      matchEvDescription  = (evStr) => {
		let found = evStr.match(evRegExp);
		if (found) {
			return {
				beginDate: found[1], 
				endDate: found[2], 
				textDescription: found[3]
		    }
		}
	  }, 
      processEvDescription = ( evInfo ) => {
		 let beginDate = dateUtils.dayStampToDate(evInfo.beginDate), 
		     endDate = dateUtils.dayStampToDate(evInfo.endDate), 
		     description = evInfo.split(':').filter(x => x.length > 1);

         let calendarEvent = new eventUtils.CalendarEvent(
				beginDate, 
				endDate, 
				description[0], 
				description[1]); 

         eventUtils.register(calendarEvent);
         return calendarEvent.id;
        }

  return {
    onReady : (eventStrings) => {
	  eventStrings.forEach( str => {
		let wellFormedEventDescription = matchEvDescription(str); 
		if(wellFormedEventDescription) {
			processEvDescription(wellFormedEventDescription);
		}
      });
      calendarUI.onReady();  
    } 
  }
})();

const eventDialogController = (function() {
  let eventBeginDate, eventEndDate, eventTitle, eventDescription;
  let dialogAction = undefined,
    eventBeginDateField = "#event-dialog-begin-date",
    eventEndDateField = "#event-dialog-end-date",
    eventTitleField = "#event-dialog-title",
    eventDescriptionField = "#event-dialog-description",

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
     eventBeginDate = fieldAsDate(eventBeginDateField);
   eventEndDate = fieldAsDate(eventEndDateField);
   eventTitle = AJS.$(eventTitleField).val();
   eventDescription = AJS.$(eventDescriptionField).val();
   return new eventUtils.Event(eventBeginDate, eventEndDate, eventTitle, eventDescription);
   },
   publishNewEventToPage(ev){

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
           console.log("publishing event to page");
           validateFormInfo();
           publishNewEventToPage(ev)
         }
     }
 })();

const eventsUI = (function(){

  return{
    makeEventView : function(index, bDate, eDate, evBody) {
      let re = /(.+)\s*\:(.+)/,
          eventTitle = evBody,
          eventDescription,
      found = evBody.match(re);
      if (found) { //the event also contains a long description
          eventTitle = found[1];
          eventDescription = found[2];
      }
      evID = processDateRange(bDate, eDate, eventTitle, eventDescription);
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
  }
  }
})();

const calendarUI = (function(){

 let uiElementsIds = {
	/* ui chrome and body elements                  */
 	CalendarTitle	: "tableCalendar-title",	
	CalendarBody	: "tableBody", 
	/* user cmds                                    */
	PreviousMonth 	: "select-previous-month", 
	NextMonth 	: "select-next-month"
	}, 

  getUIHandle = (uiID) => AJS.$("#" + uiID), 

  redrawUiAction = (action) => {
  	action();
	  calendarUI.setFormValues();
	  calendarUI.populateCalendarTable();
  }, 

  assignAction = (cmd, action) => 
	  getUIHandle(cmd).click(function(e) {
		redrawUiAction(action);
	})

  newWeekRow = (rowContent) => `<TR>${rowContent}</TR>`,

  formatCalendarUIEventView = (ev) => {
    return "<a data-aui-trigger aria-controls='more-details' href='#more-details'>" +
            ev.eventTitle.substring(0,5) + "..." +
  		      "</a>";
    },

  showDayDialog = function(dayID){
    eventDialogController.showNew(dayID);
  }

  return{

  onReady : ( ) => {
     calendarSettings.setValues();
     //attach event handlers to user controls
     assignAction(uiElementsIds.PreviousMonth, x => calendarSettings.previousMonth());
     assignAction(uiElementsIds.NextMonth, x => calendarSettings.nextMonth());
  },

 setFormValues : ( ) => { 
    //updates the form values based on the calendarSettings values
    document.dateChooser.chooseMonth.selectedIndex = calendarSettings.month;
    let yearIDX =calendarSettings.yearIdx();
    document.dateChooser.chooseYear.selectedIndex = yearIDX;
  },
  
  populateCalendarTable : ( ) => {
      // initialize date-dependent variables
      let firstDay = calendarSettings.firstDayOfMonth,
           howMany = calendarSettings.monthLength,
           dayCounter = 1, 
	   calendarBody = getUIHandle(uiElementsIds.CalendarBody);

      getUIHandle(uiElementsIds.CalendarTitle).html("<h1>" + dateUtils.monthIdxToStr(calendarSettings.month) + " " + calendarSettings.year + "</h1>");
      calendarBody.empty();

      while (dayCounter <= howMany) {
    	  let newRow = "";
    	  let addedDays = [];
    	  for(let i=0; i<7; i++){
    		if(dayCounter > howMany) {break;}
    		  if((AJS.$("#tableBody tr").length >= 1) || (i >= firstDay)){
                             let dayID = dateUtils.dayStamp(calendarSettings.year, calendarSettings.month, dayCounter),
                                eventsOnThatDay = eventUtils.eventsOn(dayID);
                         addedDays.push(dayID);
                         newRow += "<td ID='" + dayID + "' class='" + ((dayID.localeCompare(dateUtils.dayStamp()) == 0 )?"today":"day") + "'>";
                         newRow += dayCounter++;
                         if(eventsOnThatDay.length > 0){
                                                newRow += "<div class='dayEvents'>";
                        newRow += eventsOnThatDay.map(formatCalendarUIEventView).join("<br/>");
  	              newRow += "</div>";
                     }
                      newRow += "</td>";
  		  }
  		  else{
  			  newRow += "<td class='day'></td>";
  		  }
  	  }
  	calendarBody.append(newWeekRow(newRow));
    	for(let i=0; i<addedDays.length; i++){
        $("#"+addedDays[i]).click(function(){showDayDialog(addedDays[i]);});
      }
    }
  }
}
})()
