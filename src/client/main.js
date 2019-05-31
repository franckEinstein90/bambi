/*****************************************************************************/
const timeSpan = require('./timeSpan').timeSpan;
const dateUtils= require('./dateUtils').dateUtils;
const calendarEvents = require('./calendarEvents').calendarEvents;
/*****************************************************************************/



let ev = new calendarEvents.CalendarEvent(new Date(), new Date(), "x");
            let April24_2010 = new Date(2010, 03, 24), 
                April27_2010 = new Date(2010, 03, 27),
                ts = new timeSpan.Span(April24_2010, April27_2010, "day");

console.log(ts.beginDate);
console.log(dateUtils.monthIdxToStr(1));

/*AJS.toInit(function($) {

    /*********************************************************************
     * Collects everything that looks like an event description 
     * already on the page into an array of strings
     ********************************************************************/
 /*   let eventDescriptions= [];
    AJS.$("h1:contains('Events') + ul li").each(function(index) {
        eventDescriptions.push($(this).text());
    });

    /*********************************************************************
     * inits and sets-up the varous ui elements
     * using array of event description as input
     ********************************************************************/
  /*  pageContainer.onReady(eventDescriptions);

});*/
