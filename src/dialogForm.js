/******************************************************************************
 * dialogForm namespace
 * FranckEinstein
 *
 *  A library to create and manage forms in the AUI suite
 *****************************************************************************/

const dialogForm = (function() {

    /******************************************************************/
    /* events is the event registrar. It's a map object.
    /* The keys are event id strings, which calendar events
    /* get from the events.Event prototype
    /******************************************************************/
    const events = new Map();

    /******************************************************************/
    /* returns an array of calendar events filtered
    /* as per the predicate argument
    /******************************************************************/
    let makeOpeningTag = (tag, id, cssClass)=> "<" + tag + " ID='"+ id + "' class='" + cssClass + "'>",
        makeSection = (sectionTag, sectionBody, sectionID, sectionClasses)=>makeOpeningTag(sectionTag, sectionID, sectionClasses) + sectionBody + '</' + sectionTag + '>';
   return {
	createNewForm : function(dialogID){
    return makeSection("section", "", dialogID, "aui-dialog2 aui-dialog2-medium aui-layer");
	}
       /*********************************************************************/
        /* Errors, exceptions, and logs
        /*********************************************************************/
        /*Exception: function(err) {
            this.message = err;
        },
        logEvents: function() {
            events.forEach(logEvent);
        }*/
    }
})();

module.exports = {
    dialogForm
};
