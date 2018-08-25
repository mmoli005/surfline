var twilio = require('twilio');

var accountSid = 'AC0f8604db5872ce34fa9ba76647b39b84'; // Your Account SID from www.twilio.com/console
var authToken = 'c552dfb2351d99c83f83aaa8dcccf879';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.messages.create({
  body: 'Hello from Node',
  to: '+18057048496',  // Text this number
  from: '+18054919570' // From a valid Twilio number
})
  .then((message) => console.log(message.sid));