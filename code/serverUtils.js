"use strict"

const serverUtils = (function() {

    return {
        normalizePort: function(val) {
            let port = parseInt(val, 10)
            if (isNaN(port)) {
                return val

            }
            if (port >= 0) {
                return port
            }
            return false

        }
    }

})()

module.exports = {
    serverUtils
}
