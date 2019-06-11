/******************************************************************************
 * ui.js
 * ----------------
 * ***************************************************************************/

const ui = (function() {
    let uiHandle = (uiID) => AJS.$("#" + uiID),
        cmdHistory = [],
        preProcessAction = function() {
            cmdHistory.push(1);
        };
    return {
        assignAction: (cmd) => {
            uiHandle(cmd.triggerHandle).click(function(e) {
                if (cmd.preProcess) {
                    cmd.preProcess();
                }
                cmd.action(e);
                if (cmd.postProcess) {
                    cmd.postProcess();
                }
            })
        },

        UI: function(uiIds) {
            this.ids = uiIds;
        }
    }
})();


module.exports = {
    ui
};