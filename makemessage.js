function makemessage(parsedobj) {
  var msg = `Here's the report for ${parsedobj.currentSpot}. Current tide is ${
    parsedobj.currentTide
  } feet and next tide height is ${parsedobj.nextTideHeight} feet at ${
    parsedobj.nextTideTime
  }. Water temperature is ${parsedobj.waterTemp} degrees Celsius. Size is ${
    parsedobj.currentSize
  }. Condition is ${parsedobj.conditions} with max height at ${
    parsedobj.max
  } feet. Sun rises at ${parsedobj.sunriseTime} and sets at ${
    parsedobj.sunsetTime
  }.`;

  return msg;
}

module.exports = {
  makemessage: makemessage
};
