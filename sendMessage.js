var accountSid = "AC0f8604db5872ce34fa9ba76647b39b84"; // Your Account SID from www.twilio.com/console
var authToken = "c552dfb2351d99c83f83aaa8dcccf879"; // Your Auth Token from www.twilio.com/console
const twilio = require("twilio");

var client = new twilio(accountSid, authToken);

const sendMessage = (msg, to_phone) => {
  client.messages
    .create({
      body: msg,
      to: to_phone, // Text this number
      from: "+18054919570" // From a valid Twilio number
    })
    .then(message => console.log(message.sid));
};

module.exports = {
  sendMessage: sendMessage
};
