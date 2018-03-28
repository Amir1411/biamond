var commFun = require('../modules/commonFunction');
var responses = require('../modules/response'); 
var userQuery = require('../modals/user');
// sign up==
exports.signUp = function (req,res){
    var { email,password,contact_number, device_type,device_token,latitude,longitude } = req.body;
	var manValue = [ password,contact_number,device_type,device_token,latitude,longitude ];
    var check_blank = commFun.checkBlank(manValue);
	if( check_blank == 1 ) {
		responses.parameterMissing(res);
	} else {
        userQuery.userCreate(req,function(result){
            if(result == 1) {
                responses.mobileAlreayExist(res);
            } else if (result == 2 || result == 3  ){
                responses.sendError(res);
            } else {
                responses.success(res, result[0]);
            }
        });
    }
};
// login
exports.login = function(req,res) {
    var { contact_number,password,device_type,device_token,latitude,longitude } = req.body;
    var manValue = [ contact_number,password,device_type,device_token,latitude,longitude ];
	var check_blank = commFun.checkBlank(manValue);
	if( check_blank == 1 ) {
		responses.parameterMissing(res);
    } else {
        userQuery.userLogin(req,function(result){
            if( result == 1) {
                responses.sendError(res);
            } else if( result == 2 ) {
              responses.invalidCredential(res);
            } else if(result == 3 ) {
                responses.sendError(res); 
            } else {
                responses.success(res, result[0]);
            }
        });
    }
};
// send otp
exports.sendOtp = function(req,res) {
    var {contact_number} = req.body;
    var manValue = [contact_number];
    var check_blank = commFun.checkBlank(manValue);
    if( check_blank == 1 ){
        responses.parameterMissing(res);
    } else {
        userQuery.userSendOtp(req,function(result){
            if(result == 1) {
                responses.sendError(res);
            }else {
                var response = {
                    response : {},
                    message : "Otp has been send"
                }
                res.status('200').json(response);
            }
        });
    }
}
// reset password
exports.restPassword = function(req,res){
    var {password} = req.body;
    var manValue = [ password ] ;
    var check_blank = commFun.checkBlank(manValue);
    if(check_blank == 1){
        responses.parameterMissing(res);
    } else {
        userQuery.userResetPassword(req,function(result){
            if( result == 1) {
                responses.sendError(res);
            } else if( result == 2) {
                responses.passwordChanged(res);
            }
        });
    }
}