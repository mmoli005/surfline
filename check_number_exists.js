var MongoClient = require("mongodb").MongoClient;

var uri =
  "mongodb://mark:virtiumeyesonly@cluster0-shard-00-00-scwz7.mongodb.net:27017,cluster0-shard-00-01-scwz7.mongodb.net:27017,cluster0-shard-00-02-scwz7.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=false";

const check_number_exists = function(mydb, collectionname, phonenumber) {
  var num_exists = false;
  MongoClient.connect(
    uri,
    function(err, db) {
      if (err) throw err;

      var dbo = db.db(mydb);
      var myobj = { phone_number: phonenumber };

      dbo.collection(collectionname).findOne(myobj, function(err, res) {
        if (err) throw err;
        // console.log(res);
        if (res) {
          console.log("exists");

          //return true;
        } else {
          console.log("not exists");
          //return false;
        }
      });
      console.log(num_exists);

      return num_exists;
      db.close();
    }
  );
};

var exists = check_number_exists("mydb", "customers", "+18057048496");

console.log(exists);
