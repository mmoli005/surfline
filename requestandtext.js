const request = require("request");
const twilio = require("twilio");
const makemessage = require("./makemessage");
const sendMessage = require("./sendMessage");
var accountSid = "AC0f8604db5872ce34fa9ba76647b39b84"; // Your Account SID from www.twilio.com/console
var authToken = "c552dfb2351d99c83f83aaa8dcccf879"; // Your Auth Token from www.twilio.com/console

var client = new twilio(accountSid, authToken);

const surflineAPI = "http://api.surfline.com/v1/forecasts/4223?days=2";

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

//may have to save this in a different function
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

//need to modify this function to take in different spot API and different phone number
const requestandtext = function(surflineAPI, to_phone) {
  request(surflineAPI, function(error, response, body) {
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received

    //parse JSON object into a manage-able object
    var parsedObj = surflineParser(body);

    console.log(makemessage.makemessage(parsedObj));
    sendMessage.sendMessage(makemessage.makemessage(parsedObj), to_phone);
  });
};

module.exports = {
  requestandtext: requestandtext
};

//requestandtext(surflineAPI, "+18057048496");
