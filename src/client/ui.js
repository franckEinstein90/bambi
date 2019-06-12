/******************************************************************************
 * ui.js
 * ----------------
 *  Abstracts a user interface object
 * ***************************************************************************/

const ui = (function() {
            let uiHandle = (uiID) => AJS.$("#" + uiID),
                cmdHistory = [],
                preProcessAction = function() {
                    cmdHistory.push(1);
                };
            return {
                assignAction: (cmd) => {
                    cmd.triggerHandle.click(function(e) {
                        if (cmd.preProcess) {
                            cmd.preProcess();
                        }
                        cmd.action(e);
                        if (cmd.postProcess) {
                            cmd.postProcess();
                        }
                    })
                },

                newUI: function(uiIds) {
                    let obj = {};
                    for (let property in uiIds) {
                        if (uiIds.hasOwnProperty(property)) {
                            Object.defineProperty(obj, property, {
                                enumerable: false,
                                value: uiHandle(uiIds[property])
                            });
                        }
                    }
		    return obj;
                }
	}
})();

module.exports = {
	ui
};
