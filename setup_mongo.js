var MongoClient = require("mongodb").MongoClient;

var uri =
  "mongodb://mark:virtiumeyesonly@cluster0-shard-00-00-scwz7.mongodb.net:27017,cluster0-shard-00-01-scwz7.mongodb.net:27017,cluster0-shard-00-02-scwz7.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=false";

const setup_db = function(mydb, collectionname) {
  MongoClient.connect(
    uri,
    function(err, db) {
      if (err) throw err;

      var dbo = db.db(mydb);

      dbo.createCollection(collectionname, function(err, res) {
        //console.log("Im here");
        if (err) throw err;
        console.log("Collection created!");
        db.close();
      });
    }
  );
};

module.exports = {
  setup_db: setup_db
};
