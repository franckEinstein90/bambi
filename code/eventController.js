
const MongoClient = require('mongodb').MongoClient;

const eventController = (function(){
    
    let url = "mongodb://localhost:27017";
    return {
        event_list: function(req, res){
            res.send('listing events');
        },
        create_event: function(req, res){
           let eventTitle = req.body.eventTitle;
           console.log(eventTitle);
        }
    }
})();


module.exports = {
   eventController 
};


