var MongoClient = require("mongodb").MongoClient;

var uri =
  "mongodb://mark:virtiumeyesonly@cluster0-shard-00-00-scwz7.mongodb.net:27017,cluster0-shard-00-01-scwz7.mongodb.net:27017,cluster0-shard-00-02-scwz7.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=false";

const insert_user = function(
  mydb,
  collectionname,
  phonenumber,
  surf_spot,
  notifytime,
  to_notify_or_not
) {
  MongoClient.connect(
    uri,
    function(err, db) {
      if (err) throw err;
      var dbo = db.db(mydb);
      var myquery = { phone_number: phonenumber };
      var myobj_update = {
        $set: {
          phone_number: phonenumber,
          spot: surf_spot,
          timestamp: Date.now(),
          time_to_notify: notifytime,
          to_notify: to_notify_or_not
        }
      };
      var myobj = {
        phone_number: phonenumber,
        spot: surf_spot,
        timestamp: Date.now(),
        time_to_notify: notifytime,
        to_notify: to_notify_or_not
      };
      console.log(myobj);

      dbo.collection(collectionname).findOne(myquery, function(err, res) {
        if (err) throw err;
        console.log(res);
        if (res) {
          console.log("1 document found");
          dbo
            .collection(collectionname)
            .updateOne(myquery, myobj_update, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        } else {
          console.log("No document found");
          dbo.collection(collectionname).insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
          });
        }
        db.close();
      });
    }
  );
};

module.exports = {
  insert_user: insert_user
};

//insert_user("mydb", "customers", "+18057048496", "test", 627, true);
