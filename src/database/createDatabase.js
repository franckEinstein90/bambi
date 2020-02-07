const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

MongoClient.connect(url, function(err, db){

    if(err) throw err;
    let dbo = db.db("bambi");
    const myobj = {
        eventId: "xx32", 
        eventName: "blue night"
    };
    dbo.collection("events").insertOne(myobj, function(err, res){
        if(err) throw err;
        console.log("1 document inserted");
        db.close();
    });
});
