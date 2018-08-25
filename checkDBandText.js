var CronJob = require("cron").CronJob;
var MongoClient = require("mongodb").MongoClient;
const requestandtext = require("./requestandtext");
const api_provider = require("./api_provider");
const moment = require("moment");

var uri =
  "mongodb://mark:virtiumeyesonly@cluster0-shard-00-00-scwz7.mongodb.net:27017,cluster0-shard-00-01-scwz7.mongodb.net:27017,cluster0-shard-00-02-scwz7.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=false";

const job = new CronJob(
  "*/60 * * * * *",
  function() {
    MongoClient.connect(
      uri,
      function(err, db) {
        if (err) throw err;
        var time_now = moment().format("LT");

        var myquery = { time_to_notify: time_now }; //change query to time right now. extract hours and minutes

        var dbo = db.db("mydb");
        dbo
          .collection("customers")
          .find(myquery) // find document that matches the time right now.
          .toArray(function(err, res) {
            if (err) throw err;
            //time to notify is true, send message if not do not. reiterate through collection
            res.map(res_index => {
              console.log(res_index.spot);
              if (res_index.to_notify) {
                requestandtext.requestandtext(
                  api_provider.returnapi(res_index.spot),
                  res_index.phone_number
                );
              }
            });
            db.close();
          });
      }
    );
  },
  null,
  true,
  "America/Los_Angeles"
);

module.exports = {
  job: job
};
