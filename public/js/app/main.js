/*****************************************************************************/

/*****************************************************************************/


AJS.toInit(function($) {

    /*********************************************************************
     * Collects everything that looks like an event description 
     * already on the page into an array of strings
     ********************************************************************/
    let eventDescriptions= [];
    AJS.$("h1:contains('Events') + ul li").each(function(index) {
        eventDescriptions.push($(this).text());
    });

    /*********************************************************************
     * inits and sets-up the varous ui elements
     * using array of event description as input
     ********************************************************************/
    pageContainer.onReady(eventDescriptions);

});
