var config = require('../config.json');
var client = undefined;
exports.sendMessageByTwillio = sendMessageByTwillio; 

function getClient() {
	var accountSid = config.twillio.twilio_accountSid;
	var authToken = config.twillio.twilio_authToken;
	client = require('twilio')(accountSid, authToken);
}
function sendMessageByTwillio(to, msg) {
	if (client === undefined) {
		getClient();
	}
	client.messages.create({
		to: to,
		from: config.twillio.twilio_number,
		body: msg
	},
	function(err, message) {
		console.log("Twilio error: " + JSON.stringify(err));
		console.log("Twilio message: " + JSON.stringify(message));
	});
}

exports.sendOTP = function(to, otp) {
	var message = "One Time Password is " + otp + ".";
	sendMessageByTwillio(to, message );
};