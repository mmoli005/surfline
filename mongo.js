var MongoClient = require("mongodb").MongoClient;

var uri =
  "mongodb://mark:virtiumeyesonly@cluster0-shard-00-00-scwz7.mongodb.net:27017,cluster0-shard-00-01-scwz7.mongodb.net:27017,cluster0-shard-00-02-scwz7.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=false";
MongoClient.connect(
  uri,
  function(err, db) {
    if (err) throw err;
    var collectionname = "customers";
    var dbo = db.db("mydb");
    var myobj = { phone_number: "18057048496", sport: "Blackies" };
    dbo.createCollection(collectionname, function(err, res) {
      //console.log("Im here");
      if (err) throw err;
      console.log("Collection created!");
      //db.close();
    });
    dbo.collection(collectionname).insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      console.log(err);
    });
    db.close();
  }
);
