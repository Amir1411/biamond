var commFun = require('../modules/commonFunction');
var responses = require('../modules/response'); 
var constant = require('../modules/constant'); 
var userQuery = require('../modals/user');
var md5 = require("md5");
// sign up==
exports.signUp = function (req,res){
    var { email,password,mobile_number, device_type,device_token,latitude,longitude } = req.body;
	var manValue = [ password,mobile_number,device_type,device_token,latitude,longitude ];
    var check_blank = commFun.checkBlank(manValue);
	if( check_blank == 1 ) {
		responses.parameterMissing(res);
	} else {
        var data = { mobile_number: mobile_number };   
        var table_name =  constant.tableName.USER;  
        userQuery.selectQuery(table_name,data).then(function(result){
            if ( result.length > 0 ) { responses.mobileAlreayExist(res);}
            else {
                var currentTime = new Date();
                var user_id = md5(currentTime);
                var access_token = md5(currentTime); 
                var created_on = Math.round(currentTime.getTime() / 1000);                   
                var ency_pass = md5(password);
                var insertData = {
                    user_id: user_id,
                    access_token: access_token,
                    email: email,
                    password: ency_pass,
                    mobile_number: mobile_number,
                    device_type: device_type,
                    device_token: device_token,
                    latitude: latitude,
                    longitude: longitude,
                    created_on: created_on
                };
                userQuery.insertQuery(table_name,insertData).then(function(insertResult){
                    userQuery.selectQuery(table_name,data).then(function(selectResult){
                        selectResult[0].password = "";
                        responses.success(res, selectResult[0]);
                    }).catch(function(error){
                        console.log(error);
                        responses.sendError(res);
                    });
                }).catch(function(error){console.log(error);
                    responses.sendError(res);
                });
            }
        }).catch(function(error){console.log(error);
            responses.sendError(res);
        });
    }
};
// login
exports.login = function(req,res) {
    var { mobile_number,password,device_type,device_token,latitude,longitude } = req.body;
    var manValue = [ mobile_number,password,device_type,device_token,latitude,longitude ];
	var check_blank = commFun.checkBlank(manValue);
	if( check_blank == 1 ) {
		responses.parameterMissing(res);
    } else { 
        var ency_pass = md5(password);     
        userQuery.userLogin(mobile_number,ency_pass).then(function(result){
            if( result.length > 0) {
                var currentTime = new Date();
                var table_name =  constant.tableName.USER;
                var access_token = md5(currentTime);
                var updateValue = {
                    access_token : access_token,
                    device_type : device_type,
                    device_token : device_token, 
                    latitude : latitude, 
                    longitude : longitude
                };
                var  whereCond = {
                    user_id : result[0]['user_id']
                }
                userQuery.updateQuery(table_name,updateValue,whereCond).then(function(updateResult){
                    result[0]["access_token"] = access_token;
                    result[0]["device_type"] = device_type;
                    result[0]["device_token"] = device_token;
                    result[0]["latitude"] = latitude;
                    result[0]["longitude"] = longitude;
                    result[0]["password"] = "";
                    responses.success(res, result[0]);
                }).catch(function(error){                   
                    responses.sendError(res);
                });
            } else { 
                responses.invalidCredential(res);
            }
        }).catch(function(error){
            responses.sendError(res);
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
};
// reset password
exports.resetPassword = function(req,res){
    var { password } = req.body;
    var { access_token } = req.headers;
    var manValue = [ password ] ;    
    var check_blank = commFun.checkBlank(manValue);
    if(check_blank == 1){
        responses.parameterMissing(res);
    } else {
        var ency_pass = md5(password);
        var table_name =  constant.tableName.USER;
        var updateValue = {
            password : ency_pass           
        };
        var  whereCond = {
            access_token : access_token     
        };
        userQuery.updateQuery(table_name,updateValue,whereCond).then(function(result){
            responses.passwordChanged(res);
        }).catch(function(error){          
            responses.sendError(res);
        });
    }
};
// get diamond detail
exports.getDiamondDetails = function(req,res){
    var { access_token } = req.headers;
    var manValue = [ access_token ] ;
    var check_blank = commFun.checkBlank(manValue);
    if(check_blank == 1){
        responses.parameterMissing(res);
    } else {        
        var table_name =  constant.tableName.USER;        
        var  whereCond = {
            access_token : access_token     
        };
        userQuery.selectQuery(table_name,whereCond).then(function(result){
            if(result.length > 0) {
                var table_name =  constant.tableName.DIAMOND;
                var whereCond ={};
                userQuery.selectQuery(table_name,whereCond).then(function(result){
                    responses.success(res,result);
                }).catch(function(error){
                    responses.sendError(res);
                }); 
            }
        }).catch(function(error){
            responses.sendError(res);
        });
    }
};
// add wishlist
exports.addWishlist =function(req,res) {
    var {user_id,diamond_id,quantity,price} = req.body;
    var manValue = [ user_id,diamond_id,quantity,price ] ;
    var check_blank = commFun.checkBlank(manValue);
    if(check_blank == 1){
        responses.parameterMissing(res);
    } else {
        var total_price = quantity*price;
        var table_name = constant.tableName.WISHLIST;
        var wishlist_id = md5(new Date());
        var created_on = md5(new Date());
        var is_payment = 0 ;
        var insertField = {
            wishlist_id:wishlist_id,
            user_id:user_id,
            diamond_id:diamond_id,
            quantity:quantity,
            price:total_price,
            is_payment: is_payment,
            created_on : created_on
            };    
        userQuery.selectWishlist(user_id,diamond_id).then(function(selectResult){
            if(selectResult.length > 0 ) { 
                userQuery.updateWishlist(quantity,total_price,user_id,diamond_id).then(function(result){
                    var response ={
                        response : {},
                        message : 'updated succesfully'
                    };
                    res.status('200').json(response);     
                }).catch(function(error){
                    responses.sendError(res);
                });
            } else { 
                userQuery.insertQuery(table_name,insertField).then(function(result){
                   var response ={
                       response : {},
                       message : 'added succesfully'
                   };
                   res.status('200').json(response);          
                }).catch(function(error){           
                    responses.sendError(res);
                });
            }
        }).catch(function(error){console.log(error); 
            responses.sendError(res);
        });            
    }
};
// get Wishlist 
exports.getWishlist = function(req,res){
    var { access_token,user_id } = req.headers;
    var manValue = [ access_token,user_id ] ;
    var check_blank = commFun.checkBlank(manValue);
    if(check_blank == 1){
        responses.parameterMissing(res);
    } else {
        var table_name = constant.tableName.WISHLIST;
        var whereCond = {
            access_token :access_token
        }; 
        userQuery.selectQuery(table_name,whereCond).then(function(result){
            if( result.length > 0 ) {
                userQuery.getWishlist(user_id).then(function(wishlistResult){
                 var response = {
                     response : wishlistResult,
                     message : 'done'
                 }
                 res.status('200').json(response);
                }).catch(function(error){
                    responses.sendError(error);
                });
            } else {
                responses.invalidToken(res);
            }
        }).catch(function(error){
            responses.sendError(error);
        });
        
    } 
};
// remove wishlist
exports.deleteWishlist = function(req,res){
    console.log('jhjhkjhkj');
    var { wishlist_id } = req.body;
    console.log(req.body);
    var manValue = [ wishlist_id ];
    var checkBlank = commFun.checkBlank(manValue);
    if( checkBlank == 1 ) { 
        responses.parameterMissing(res);
    } else {       
        var table_name = constant.tableName.WISHLIST;
        var whereCond = {
            wishlist_id:wishlist_id
        };
        userQuery.deleteQuery(table_name,whereCond).then(function(result){
            var response = {
                response : {},
                message : ' delete successfully',
            };
            res.status('200').json(response);
        }).catch(function(error){
            responses.sendError(error);
        });
    }
};
//add user address
exports.addUserAddress =function(req,res) {
    var {user_id,full_name,mobile_number,house_number,city,landmark,state,country,zip_code } = req.body;
    var manValue = [ user_id,full_name,mobile_number,house_number,city,landmark,state,country,zip_code ] ;
    var check_blank = commFun.checkBlank(manValue);
    if(check_blank == 1){
        responses.parameterMissing(res);
    } else {
        userQuery.addUserAddress(req,function(result){
            if(result == 1  ) {
             responses.sendError(res);
            } 
            if( result == 2 ) {
                var response = {
                    response : {},
                    message : 'added successfully',
                };
                res.status('200').json(response);
            } 
        });
    }
};
// get user address
exports.getUserAddress = function(req,res){
    var { access_token,user_id } = req.headers;
    var manValue = [ access_token,user_id ];
    var checkBlank = commFun.checkBlank(manValue);
    if( checkBlank ==1 ) {
        responses.parameterMissing(res);
    } else {
        userQuery.getUserAddress(req,function(result){
            if(result == 1 || result == 3 ) {
             responses.sendError(res);
            }  else if( result == 2 ) {
             responses.invalidToken(res);
            } else {
             responses.success(res,result);
            }
        });
    }    
 };