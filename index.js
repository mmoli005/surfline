const http = require("http");
const express = require("express");
const session = require("express-session");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const bodyParser = require("body-parser");
const requestandtext = require("./requestandtext");
const api_provider = require("./api_provider");
const setup_mongo = require("./setup_mongo");
const insert_mongo = require("./insert_monngo");
const checkDBandText = require("./checkDBandText");

const app = express();
const NORTHHBPIER = "northhb";
const THIRTYSIXTHST = "36thst";
const BLACKIES = "blackies";
const OLDMANS = "oldmans";
const DOHENY = "doheny";
const SALTCREEK = "saltcreek";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "anything-you-want-but-keep-secret" }));

//setup constants

const DB_NAME = "mydb";
const COLLECTION_NAME = "customers";
const REMINDER_TIME = "6:00 AM";
const TO_NOTIFY = true;

//start cron job to notify user
console.log("Start CRON JOB...");
checkDBandText.job.start();

//setup Mongo DB
console.log("Set up Mondog DB...");
setup_mongo.setup_db(DB_NAME, COLLECTION_NAME);

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.post("/sms", (req, res) => {
  const smsCount = req.session.counter || 0;
  console.log(`This is the sms Count: ${smsCount} for ${req.body.From}`);
  var msg = "";
  var apiloc = "";
  const twiml = new MessagingResponse();
  if (smsCount == 0) {
    if (req.body.Body.toLowerCase() == "hello") {
      msg =
        "Where do you want to surf? Pick a number \n 1. North OC\n 2. South OC \n 3. North SD (unavailable)\n 4. South SD (unavailable)";
      twiml.message(msg);
      req.session.counter = smsCount + 1;
    } else {
      twiml.message("You have to say 'Hello' first!");
    }
  } else if (smsCount == 1) {
    if (req.body.Body.toLowerCase() == "1") {
      msg =
        "Choose a spot in North OC:\n 1. North HB Pier 2. 36th Street 3. Blackies ";
      twiml.message(msg);
      req.session.counter = smsCount + 1;
    } else if (req.body.Body.toLowerCase() == "2") {
      msg =
        "Choose a spot in South OC:\n 1. Old Mans 2. Doheny State Beach 3. Salt Creek";
      twiml.message(msg);
      req.session.counter = smsCount + 2; //go to smsCount 3
    } else {
      msg =
        "You have to pick a valid option!\n 1. North OC\n 2. South OC \n 3. North SD (unavailable)\n 4. South SD (unavailable) ";
      twiml.message(msg);
    }
  } else if (smsCount == 2) {
    if (req.body.Body == "1") {
      msg = `Your phone is registered with North HB Pier. You will get notifications at ${REMINDER_TIME}`;
      //setup DB to relate phone number with spot location
      insert_mongo.insert_user(
        DB_NAME,
        COLLECTION_NAME,
        req.body.From,
        NORTHHBPIER,
        REMINDER_TIME,
        TO_NOTIFY
      );
      //get location api
      apiloc = api_provider.returnapi(NORTHHBPIER); // this should return promise obj with api loc passed to request and text
      //send spot report right now
      requestandtext.requestandtext(apiloc, req.body.From);

      twiml.message(msg);
      req.session.counter = 0;
    } else if (req.body.Body == "2") {
      msg = `Your phone is registered with 36th Street. You will get notifications at ${REMINDER_TIME}`;
      //setup DB to relate phone number with spot location
      insert_mongo.insert_user(
        DB_NAME,
        COLLECTION_NAME,
        req.body.From,
        THIRTYSIXTHST,
        REMINDER_TIME,
        TO_NOTIFY
      );
      //get location api
      apiloc = api_provider.returnapi(THIRTYSIXTHST);
      //send spot report right now
      requestandtext.requestandtext(apiloc, req.body.From);
      twiml.message(msg);
      req.session.counter = 0;
    } else if (req.body.Body == "3") {
      msg = `Your phone is registered with Blackies. You will get notifications at ${REMINDER_TIME}`;
      //setup DB to relate phone number with spot location
      insert_mongo.insert_user(
        DB_NAME,
        COLLECTION_NAME,
        req.body.From,
        BLACKIES,
        REMINDER_TIME,
        TO_NOTIFY
      );
      //get location api
      apiloc = api_provider.returnapi(BLACKIES);
      //send spot report right now
      requestandtext.requestandtext(apiloc, req.body.From);
      twiml.message(msg);
      req.session.counter = 0;
    } else {
      msg =
        "Invalid option. Choose a spot again:\n 1. North HB Pier 2. 36th Street  3. Blackies ";
      twiml.message(msg);
    }
  } else if (smsCount == 3) {
    if (req.body.Body == "1") {
      msg = `Your phone is registered with Old Mans. You will get notifications at ${REMINDER_TIME}`;
      //setup DB to relate phone number with spot location
      insert_mongo.insert_user(
        DB_NAME,
        COLLECTION_NAME,
        req.body.From,
        OLDMANS,
        REMINDER_TIME,
        TO_NOTIFY
      );
      //get location api
      apiloc = api_provider.returnapi(OLDMANS); // this should return promise obj with api loc passed to request and text
      //send spot report right now
      requestandtext.requestandtext(apiloc, req.body.From);

      twiml.message(msg);
      req.session.counter = 0;
    } else if (req.body.Body == "2") {
      msg = `Your phone is registered with Doheny State Beach. You will get notifications at ${REMINDER_TIME}`;
      //setup DB to relate phone number with spot location
      insert_mongo.insert_user(
        DB_NAME,
        COLLECTION_NAME,
        req.body.From,
        DOHENY,
        REMINDER_TIME,
        TO_NOTIFY
      );
      //get location api
      apiloc = api_provider.returnapi(DOHENY);
      //send spot report right now
      requestandtext.requestandtext(apiloc, req.body.From);
      twiml.message(msg);
      req.session.counter = 0;
    } else if (req.body.Body == "3") {
      msg = `Your phone is registered with Salt Creek. You will get notifications at ${REMINDER_TIME}`;
      //setup DB to relate phone number with spot location
      insert_mongo.insert_user(
        DB_NAME,
        COLLECTION_NAME,
        req.body.From,
        SALTCREEK,
        REMINDER_TIME,
        TO_NOTIFY
      );
      //get location api
      apiloc = api_provider.returnapi(SALTCREEK);
      //send spot report right now
      requestandtext.requestandtext(apiloc, req.body.From);
      twiml.message(msg);
      req.session.counter = 0;
    } else {
      msg =
        "Invalid option. Choose a spot again:\n 1. Old Mans 2. Doheny State Beach  3. Salt Creek ";
      twiml.message(msg);
    }
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
  console.log("Somebody texted you");
});
var port = process.env.PORT || 8000;

http.createServer(app).listen(port, () => {
  console.log("Express server listening on port 1337");
});
