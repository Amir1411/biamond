var nodemailer = require('nodemailer');
var Handlebars = require('handlebars');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../config.json');


const SendGrid = {
	"host" : config.SendGrid.SendGrid_host,
	"auth" : {
		"user":config.SendGrid.SendGrid_auth.SendGrid_user,
		"pass":config.SendGrid.SendGrid_auth.SendGrid_pass
	}
}
const transporter = nodemailer.createTransport(smtpTransport(SendGrid));

exports.sendEmailViaTemplate = (to, subject, html) => {
	var mailOptions = {
		from: config.emailCredentials.From,
		to: to,
		subject: subject,
		html: html
    };
    transporter.sendMail(mailOptions, function(error, info) {
		console.log('Mail Sent Callback Error:', error);
		console.log('Mail Sent Callback Ifo:', info);
	});	
};