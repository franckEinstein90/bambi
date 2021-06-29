/******************************************************************************
 *
 * appRoot renders the app's entry points
 * ***************************************************************************/
"use strict"

/*****************************************************************************/
/*****************************************************************************/

const _accountRouter = ( function() {

    return {

        getUser: function(req, res, next) {
            const userId = +req.params.userId; 
            res.send(`User: ${userId}`) ;
            next(); 
        }



   } ; 

})() ; 

const accountRouter = require('express').Router() ; 
accountRouter.get('/:userId(\\d+)', _accountRouter.getUser) ;

module.exports = {
    accountRouter
}
