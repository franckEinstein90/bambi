AJS.$("#dialog-submit-button").click(function (e) {
         let beginDate = $("#begin-date").val(),
             endDate = $("#dateEnd").val(),
             eventName = $("#event-dialog-title").val(),
             eventDesc = $("#descr").val();

         e.preventDefault();
         if(eventName.length < 1 ){
           AJS.flag({
             type:'error',
             title: 'You must provide a name for the event',
             body: "An event name is necessary to create a new event"
           });
           AJS.dialog2("#event-dialog").hide();
           return;
         }
         dateUtils.setSeparator("-");
         if(dateUtils.dayStampToDate(endDate) < dateUtils.dayStampToDate(beginDate)){
           AJS.flag({
             type:'error',
             title: 'Invalid end date',
             body: 'The end date for your event should be after or on the start date',
           });
           AJS.dialog2("#event-dialog").hide();
           return; //exit create event without creating an event
         }

         console.log("creating a new event from " + beginDate + " to " + endDate);
         let ev = eventUtils.newEvent(dateUtils.dayStampToDate(beginDate), dateUtils.dayStampToDate(endDate), eventName, eventDesc);
         eventDialog.createNewEvent(ev);
         AJS.dialog2("#event-dialog").hide();
     });
