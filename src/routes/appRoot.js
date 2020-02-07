/******************************************************************************
 *
 * appRoot renders the app's entry points
 * ***************************************************************************/
"use strict"

/*****************************************************************************/
/*****************************************************************************/

const appRoot = (function() {

    return {

        render: function(req, res, next) {

            let homePageData = {
                title: 'bambi',
                userName: 'login', 
                state: 'initializing'
            }
            res.render('index', homePageData)
        } 

   }

})()

module.exports = {
    appRoot
}
