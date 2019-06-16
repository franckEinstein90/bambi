
const eventController = (function(){
    return {
        event_list: function(req, res){
            res.send('listing events');
        }
    }
})();


module.exports = {
   eventController 
};


