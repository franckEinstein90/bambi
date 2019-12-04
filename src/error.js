"use strict"; const errors = (function() {

return {
        doError: function({
            title,
            body
        }) {
            AJS.flag({
                type: 'error',
                title: title,
                body: body
            });
        }

    }

})();

module.exports = {
    errors
};