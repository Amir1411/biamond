var constant = require('./constant');

exports.parameterMissing = function(res) {
	var response = {
		response: {},
		message: constant.responseMessages.PARAMETER_MISSING
	};
	res.status(constant.responseFlags.PARAMETER_MISSING).json(response);
};
exports.sendError = function(res) {
	var response = {
		response: {},
		message: constant.responseMessages.ERROR_IN_EXECUTION
	};
	res.status(constant.responseFlags.ERROR_IN_EXECUTION).json(response);
};
exports.invalidCredential = function(res) {
	var response = {
		response: {},
		message: constant.responseMessages.INVALID_CREDENTIAL
	};
	res.status(constant.responseFlags.INVALID_CREDENTIAL).json(response);
};
exports.succesMessage = function(res) {
	var response = {
		response: {},
		message: constant.responseMessages.LOGIN_SUCCESSFULLY
	};
	res.status(constant.responseFlags.LOGIN_SUCCESSFULLY).json(response);
};
exports.success = function(res, result) {
	var response = {
		response: result,
		message: constant.responseMessages.ACTION_COMPLETE
	};
	res.status(constant.responseFlags.ACTION_COMPLETE).json(response);
};
exports.socialCredential = function(res) {
	var response = {
		response: {},
		message: constant.responseMessages.SOCIAL_CREDENTIAL
	};
	res.status(constant.responseFlags.SOCIAL_CREDENTIAL).json(response);
};
exports.emailNotExist = function(res) {
	var response = {
		response: {},
		message: constant.responseMessages.EMAIL_NOT_EXIST
	};
	res.status(constant.responseFlags.EMAIL_NOT_EXIST).json(response);
};
exports.otpNotVerify = function(res) {
	var response = {
		response: {},
		message: constant.responseMessages.INVALID_OTP
	};
	res.status(constant.responseFlags.INVALID_OTP).json(response);
};
exports.otpVerify = function(res, result) {
	var response = {
		response: result,
		message: constant.responseMessages.OTP_VERIFY
	};
	res.status(constant.responseFlags.OTP_VERIFY).json(response);
};
exports.emailVerify = function(res, result) {
	var response = {
		response: result,
		message: constant.responseMessages.EMAIL_VERIFY
	};
	res.status(constant.responseFlags.EMAIL_VERIFY).json(response);
};
exports.passwordExist = function(res) {
	var response = {
		response: {},
		message: constant.responseMessages.ALREADY_EXIST
	};
	res.status(constant.responseFlags.ALREADY_EXIST).json(response);
};
exports.passwordChanged = function(res) {
	var response = {
		response: {},
		message: constant.responseMessages.PASSWORD_CHANGED_SUCCESSFULLY
	};
	res.status(constant.responseFlags.PASSWORD_CHANGED_SUCCESSFULLY).json(response);
};
exports.userNotCreated = function(res) {
	var response = {
		response: {},
		message: constant.responseMessages.USER_NOT_CREATED
	};
	res.status(constant.responseFlags.USER_NOT_CREATED).json(response);
};
exports.userkeyNotExist = function(res,i) {
	var response = {
		response: {},
		message: " Invalid key or value of "+ i
	};
	res.status('403').json(response);
};
exports.mobileAlreayExist = function(res){
	var response = {
		response: {},
		message: constant.responseMessages.MOBILE_NUMBER_ALREADY_EXIST
	};
	res.status(constant.responseFlags.MOBILE_NUMBER_ALREADY_EXIST).json(response);
};
exports.invalidToken = function(res){
	var response = {
		response: {},
		message: constant.responseMessages.INVALID_ACCESS_TOKEN
	};
	res.status(constant.responseFlags.INVALID_ACCESS_TOKEN).json(response);
};
exports.dataNotFound = function(res){
	var response = {
		response: {},
		message: constant.responseMessages.NO_DATA_FOUND
	};
	res.status(constant.responseFlags.NO_DATA_FOUND).json(response);
};
exports.addedSuccessfully = function(res){
	var response = {
		response: {},
		message: constant.responseMessages.ADDED_SUCCESSFULLY
	};
	res.status(constant.responseFlags.ADDED_SUCCESSFULLY).json(response);
};
exports.updatedSuccessfully = function(res){
	var response = {
		response: {},
		message: constant.responseMessages.UPDATED_SUCCESSFULLY
	};
	res.status(constant.responseFlags.UPDATED_SUCCESSFULLY).json(response);
};
exports.notAdded = function(res){
	var response = {
		response: {},
		message: constant.responseMessages.NOT_ADDED
	};
	res.status(constant.responseFlags.NOT_ADDED).json(response);
};
exports.notUpdated = function(res){
	var response = {
		response: {},
		message: constant.responseMessages.NOT_UPDATED
	};
	res.status(constant.responseFlags.NOT_UPDATED).json(response);
};
exports.mobileNotVerify = function(res){ 
	var response = {
		response: {},
		message: constant.responseMessages.MOBILE_NOT_VERIFY
	};
	res.status(constant.responseFlags.MOBILE_NOT_VERIFY).json(response);
};
exports.mobileNotRegister = function(res){
	var response = {
		response: {},
		message: constant.responseMessages.MOBILE_NOT_REGISTER
	};
	res.status(constant.responseFlags.MOBILE_NOT_REGISTER).json(response);
};