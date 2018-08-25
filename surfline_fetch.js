const request = require("request");
const twilio = require("twilio");
var accountSid = "AC0f8604db5872ce34fa9ba76647b39b84"; // Your Account SID from www.twilio.com/console
var authToken = "c552dfb2351d99c83f83aaa8dcccf879"; // Your Auth Token from www.twilio.com/console

var client = new twilio(accountSid, authToken);

const surflineAPI = "http://api.surfline.com/v1/forecasts/53412";

//var surflineJson

//console.log(surflineAPI);

function extrapolateTideHeight(tideArray) {
  var today = Date.now();
  var closeTimes = tideArray.sort(function(a, b) {
    var da = Math.abs(today - Date.parse(a.Rawtime));
    var db = Math.abs(today - Date.parse(b.Rawtime));
    return da - db;
  });
  var closestTimes = closeTimes.filter(function(tideObject) {
    if (tideObject.type === "Sunset" || tideObject.type === "Sunrise") {
      return false;
    }
    return true;
  });

  var heightDistance = closestTimes[0].height - closestTimes[1].height;
  var timeDifference =
    Date.parse(closestTimes[0].Rawtime) - Date.parse(closestTimes[1].Rawtime);
  var heightChangePerMS = heightDistance / timeDifference;
  var msChange = today - Date.parse(closestTimes[0].Rawtime);
  var newHeight =
    Math.round((heightChangePerMS * msChange + closestTimes[0].height) * 100) /
    100;
  return newHeight;
}
function surflineParser(spotData) {
  var newData = JSON.parse(spotData);

  var bodyData = {};
  var tideObject = newData.Tide.dataPoints.find(tideObject => {
    return (
      Date.now() < Date.parse(tideObject.Rawtime) &&
      (tideObject.type === "High" || tideObject.type === "Low")
    );
  });

  bodyData["currentSpot"] = newData.name;
  bodyData["currentTide"] = extrapolateTideHeight(newData.Tide.dataPoints);
  bodyData["nextTideHeight"] = tideObject.height;
  bodyData["nextTideType"] = tideObject.type;
  bodyData["nextTideTime"] = tideObject.Rawtime;
  bodyData["sunsetTime"] = newData.Tide.SunPoints.find(sunPointObject => {
    return sunPointObject.type === "Sunset";
  }).Rawtime;
  bodyData["sunriseTime"] = newData.Tide.SunPoints.find(sunPointObject => {
    return sunPointObject.type === "Sunrise";
  }).Rawtime;
  bodyData["waterTemp"] =
    (newData.WaterTemp.watertemp_min + newData.WaterTemp.watertemp_max) / 2;
  bodyData["currentSize"] = newData.Analysis.surfRange[0];
  bodyData["conditions"] = newData.Analysis.generalCondition;
  bodyData["max"] = newData.Surf.surf_max_maximum;
  bodyData["min"] = Math.min(newData.Surf.surf_min[0]);
  return bodyData;
}

function convertMS(ms) {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  return { d: d, h: h, m: m, s: s };
}

var sendMessage = msg =>
  client.messages
    .create({
      body: msg,
      to: "+18057048496", // Text this number
      from: "+18054919570" // From a valid Twilio number
    })
    .then(message => console.log(message.sid));

const requestandtext = function() {
  request(surflineAPI, function(error, response, body) {
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received

    //parse JSON object into a manage-able object
    var parsedObj = surflineParser(body);

    //look for the sunrise time. format in UCT
    var sunriseTime = parsedObj.sunriseTime;

    //turn input date into unix time unit
    var sunriseTimeinMS = Date.parse(sunriseTime);
    // find sleepTime for 7 hours prior to tomorrows sunrise which is 17 hours

    var seventeenhours = 61200000;
    var sleepTime = sunriseTimeinMS + seventeenhours;

    // This is the time I will need to sleep
    var sleepTimeinDateFormat = new Date(sleepTime);
    //console.log('test')
    //  console.log (sleepTimeinDateFormat)

    var dateNow = Date.now() - 10800000;

    var dateNowinDateFormat = new Date(dateNow);

    console.log("Date now: " + dateNowinDateFormat);

    //Determine How many hours and minutes before going to sleep
    var hrsbeforeslp = sleepTime - dateNow;

    var timebeforesleep = convertMS(hrsbeforeslp);

    //console.log(timebeforesleep)

    // determine if size is big enough
    var maxwavesize = parsedObj.max;
    // minimum minimum required  wave size
    const minreqsize = 3;

    if (maxwavesize > minreqsize) {
      textMessage =
        "You have " +
        timebeforesleep.h +
        " hours and " +
        timebeforesleep.m +
        " minutes before going to sleep" +
        ". Max wave size is " +
        maxwavesize;
      sendMessage(textMessage);
      console.log(textMessage);
    } else {
      textMessage = "Surfs no good tomorrow. Do something else";
      sendMessage(textMessage);
    }
  });
};

// get date right now now
var nowdateinms = Date.now();
//ofset 3 hours for timezone
var actualnowdate = nowdateinms - 10800000;
//create an object and set it to 1800 pm time
var tomorrowDate = new Date();
tomorrowDate.setHours(18);
// six pm tomorrow in ms
var sixpmtomorrow = tomorrowDate.getTime();
//
var differenceinms = sixpmtomorrow - actualnowdate;

var diffinhours = convertMS(differenceinms);
//output hours to 1800
console.log(diffinhours);

var mainApp = function() {
  var sixpmnow = Date.now();
  var sixpmobj = new Date(sixpmnow);
  console.log("It is now time to start Polling");
  console.log(sixpmobj);
  const twentyfourhrs = 86400000;
  requestandtext();
  setInterval(requestandtext, twentyfourhrs);
};

var nowdateobj = new Date(nowdateinms);

console.log(nowdateobj);

setTimeout(mainApp, differenceinms);
