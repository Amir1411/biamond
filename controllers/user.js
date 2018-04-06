
var commFun = require('../modules/commonFunction');
var responses = require('../modules/response'); 
var constant = require('../modules/constant'); 
var userController = require('../modals/user');
var message = require('../modules/message'); 
var md5 = require("md5");
var async = require('async');
// sign up==
exports.signUp = function (req,res){
    var { email, password,mobile_number, device_type, device_token, latitude, longitude } = req.body;
	var manValue = [ password, mobile_number, device_type, device_token, latitude, longitude ];
    var check_blank = commFun.checkBlank(manValue);
	if( check_blank == 1 ) {
		responses.parameterMissing(res);
	} else {
        var data = { mobile_number: mobile_number };   
        var table_name =  constant.tableName.USER; 
        //++ check user exist ++// 
        userController.selectQuery(table_name,data).then(function(result){
            if ( result.length > 0 )  responses.mobileAlreayExist(res);
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
                //++ insert user ++//
                userController.insertQuery(table_name,insertData).then(function(insertResult){                
                   if( insertResult.affectedRows > 0 ) {
                        var  otp = commFun.generateRandomString();
                        message.sendOTP(mobile_number, otp);
                        var valueField = { verification_code: otp };
                        var whereCond = { access_token: access_token };
                        // insert otp into current inserted user
                        userController.updateQuery(table_name,valueField,whereCond).then(function(updateOtp){
                            if( updateOtp.affectedRows > 0 ) {
                                //++ select data of inserted user ++//
                                userController.selectQuery(table_name,data).then(function(selectResult){
                                    selectResult[0].password = "";
                                    var response = {
                                        response : selectResult[0],
                                        message : 'OTP send'
                                    };
                                    res.status('200').json(response);
                                }).catch(function(error){ 
                                    responses.sendError(res);
                                });                            
                            } else {
                                var response = {
                                    response : {},
                                    message : 'OTP not send'
                                };
                                res.status('200').json(response);
                            }
                        });
                   } else responses.notAdded(res);      
                }).catch(function(error){
                    responses.sendError(res);
                });
            }
        }).catch(function(error){
            responses.sendError(res);
        });
    }
};
// verify otp
exports.verifyOtp = function (req,res){
    var { access_token } = req.headers;
    var { otp } = req.body;
    var manValue = [ access_token,otp ];
    var check_blank = commFun.checkBlank(manValue);
	if( check_blank == 1 ) {
		responses.parameterMissing(res);
    } else { 
        var table_name = constant.tableName.USER;
        var whereCond = { access_token:access_token };
       userController.selectQuery(table_name,whereCond).then(function(result){
            if( result.length > 0 ) {
                var otpWhereCond = {verification_code:otp};
                userController.selectQuery(table_name,otpWhereCond).then(function(otpResult){
                    if( otpResult.length > 0 ){
                        var is_verified = 1;
                        var verifyCond = { is_verified:is_verified};
                        userController.updateQuery(table_name,verifyCond,whereCond).then(function(verifyResult){
                            if( verifyResult.affectedRows > 0 ) {
                                otpResult[0]['is_verified'] = is_verified ;
                                responses.otpVerify(res,otpResult[0]);
                            } else responses.otpNotVerify(res);
                        });
                    } else responses.otpNotVerify(res);
                }).catch(function(error){
                    responses.sendError(error);
                }); 
            } else responses.invalidToken(res);
       }).catch(function(error){
           responses.sendError(error);
       }); 
    }    
};
// login
exports.login = function(req,res) {
    var { mobile_number, password, device_type, device_token, latitude, longitude } = req.body;
    var manValue = [ mobile_number, password, device_type, device_token, latitude, longitude ];
	var check_blank = commFun.checkBlank(manValue);
	if( check_blank == 1 ) {
		responses.parameterMissing(res);
    } else { 
        var ency_pass = md5(password); 
        userController.userLogin(mobile_number,ency_pass).then(function(result){
            if( result.length > 0) {
               if ( result[0].is_verified == 0 ) {              
                   responses.mobileNotVerify(res);
                } else {
                    var currentTime = new Date();
                    var table_name =  constant.tableName.USER;
                    var access_token = md5(currentTime);               
                    var  whereCond = { user_id : result[0]['user_id'] }
                    var updateValue = {
                        access_token : access_token,
                        device_type : device_type,
                        device_token : device_token, 
                        latitude : latitude, 
                        longitude : longitude
                    };
                    userController.updateQuery(table_name,updateValue,whereCond).then(function(updateResult){
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
                }
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
    var { mobile_number } = req.body;
    var manValue = [ mobile_number ];
    var check_blank = commFun.checkBlank(manValue);
    if( check_blank == 1 ){
        responses.parameterMissing(res);
    } else {
        userController.userSendOtp(req,function(result){
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
        var updateValue = { password : ency_pass };
        var whereCond = { access_token : access_token };
        //++ update password ++//
        userController.updateQuery(table_name,updateValue,whereCond).then(function(result){
          if(result.affectedRows > 0 )  responses.passwordChanged(res);
          else responses.invalidToken(res);
        }).catch(function(error){          
            responses.sendError(res);
        });
    }
};
// forgot password
exports.forgotPassword = function(req,res){
    var { mobile_number } = req.body;
    var table_name = constant.tableName.USER;
    var whereCond = { mobile_number:mobile_number };
    userController.selectQuery(table_name,whereCond).then(function(result){
        if( result.length > 0 ) {
            var  otp = commFun.generateRandomString();
            message.sendOTP(mobile_number, otp);
            var whereCond = { access_token : result[0]['access_token'] };
            var updateField = { verification_code:otp };
            userController.updateQuery(table_name,updateField,whereCond).then(function(updateOtp){
                if( updateOtp.affectedRows > 0 ) {
                    var response = {
                        response : {},
                        message : 'OTP send'
                    };
                    res.status('200').json(response);
                } else {
                    var response = {
                        response : {},
                        message : 'OTP not send'
                    };
                    res.status('200').json(response);
                }
            }).catch(function(error){
                responses.sendError(error);
            });
        } else responses.mobileNotRegister(res);
    }).catch(function(error){
        responses.sendError(error);
    });
};
// get diamond list
exports.getDiamondList = function(req,res){
    var { access_token } = req.headers;
    var manValue = [ access_token ] ;
    var check_blank = commFun.checkBlank(manValue);
    if(check_blank == 1){
        responses.parameterMissing(res);
    } else {        
        var table_name =  constant.tableName.USER;        
        var  whereCond = { access_token : access_token };
        //++ check user exist ++//
        userController.selectQuery(table_name,whereCond).then(function(result){
            if(result.length > 0) {
                var table_name =  constant.tableName.DIAMOND;
                var diamondCond = {};
                //++ diamond list ++//
                userController.selectQuery(table_name,diamondCond).then(function(diamondResult){
                   if( diamondResult.length > 0 ) responses.success(res,diamondResult);
                   else responses.dataNotFound(res);
                }).catch(function(error){
                    responses.sendError(res);
                }); 
            } else responses.invalidToken(res);
        }).catch(function(error){ 
            responses.sendError(res);
        });
    }
};
// get diamond detail 
exports.getDiamondDetail = function(req,res){
    var { access_token } = req.headers;
    var { diamond_id } = req.body;
    var manValue = [ access_token, diamond_id ];
    var checkBlank = commFun.checkBlank(manValue);
    var table_name = constant.tableName.USER;
    var selectField = { access_token:access_token };
    userController.selectQuery(table_name,selectField).then(function(result){
        if( result.length > 0 ) {
            var table_name = constant.tableName.DIAMOND;
            var whereCond = { diamond_id:diamond_id };
            userController.selectQuery(table_name,whereCond).then(function(selectResult){
                if( selectResult.length > 0 ) responses.success(res,selectResult[0]); 
                else responses.dataNotFound(res);
            });
        } else responses.invalidToken(res);
    }).catch(function(error){
        responses.sendError(res);
    });
}
// add watchlist
exports.addWatchlist =function(req,res) {
    var { access_token } = req.headers;
    var { user_id, diamond_id, quantity } = req.body;
    var manValue = [ user_id,diamond_id,quantity ] ;
    var check_blank = commFun.checkBlank(manValue);
    if(check_blank == 1){
        responses.parameterMissing(res);
    } else {    
        var currentTime = new Date();
        var table_name = constant.tableName.USER;
        var watchlist_id = md5(currentTime);
        var created_on = Math.round(currentTime.getTime() / 1000);
        var is_payment = 0 ;
        var userField = {access_token:access_token};            
        //++ user exist ++//
        userController.selectQuery(table_name,userField).then(function(userResult){
            if( userResult.length > 0 ) {
                 // get diamond price realted details ==
                var table_name = constant.tableName.DIAMOND;
                var diamondCond = { diamond_id:diamond_id };
                userController.selectQuery(table_name,diamondCond).then(function(priceResult){
                    var sub_total = ''; 
                    console.log(priceResult);
                    var price = priceResult[0].current_price;
                    var shipping_fee = priceResult[0].shipping_fee;                    
                    var tax = priceResult[0].tax;                   
                    if( price != '' ) {
                        sub_total = quantity * price;
                    }                    
                    if( shipping_fee != '' ) {
                        sub_total = parseFloat(sub_total) + parseFloat(shipping_fee);
                    }
                    if( tax != '' ) {
                        tax = tax/100;
                        sub_total = parseFloat(sub_total) +  parseFloat(tax);
                    }                    
                    var table_name = constant.tableName.WATCHLIST;
                    var insertField = {
                        watchlist_id:watchlist_id,
                        user_id:user_id,
                        diamond_id:diamond_id,
                        quantity:quantity,
                        sub_total:sub_total,
                        is_payment: is_payment,
                        created_on : created_on
                        };     
                    userController.selectWatchlist(user_id,diamond_id).then(function(selectResult){
                    if(selectResult.length > 0 ) { 
                        //++ if diamond already  then UPDATE ++//
                        userController.updateWatchlist(quantity,sub_total,user_id,diamond_id).then(function(result){
                            if( result.affectedRows > 0 ) responses.updatedSuccessfully(res);
                            else responses.notUpdated(res);    
                        }).catch(function(error){
                            console.log(error);
                            responses.sendError(res);
                        });
                    } else {
                        var selectCond = {user_id:user_id};                       
                        userController.selectQuery(table_name,selectCond).then(function(totalDiamondResult){
                            var maxLimit = 25;
                            var totalDiamondInWatchList = totalDiamondResult.length;
                            // check max limit of user to add diamond in watchlist
                            if( totalDiamondInWatchList < maxLimit ) {
                                //++ insert first time ++//
                                userController.insertQuery(table_name,insertField).then(function(result){
                                    if( result.affectedRows > 0 ) responses.addedSuccessfully(res);
                                    else responses.notAdded(res);
                                }).catch(function(error){         
                                    responses.sendError(res);
                                });
                            } else {
                                var response = {
                                    response : {},
                                    message : 'You excceed your limit',
                                };
                                res.status('201').json(response);
                            }                            
                       }).catch(function(error){console.log(error);
                        responses.sendError(res);
                        });
                    }
                    }).catch(function(error){console.log(error);
                        responses.sendError(res);
                    }); 
                }).catch(function(error){
                    console.log(error);
                    responses.sendError(res);
                });                 
            } else responses.invalidToken(res);
        }).catch(function(error){
            responses.sendError(res);
        });
    }
};
// get watchlist 
exports.getWatchlist = function(req,res){
    var { access_token } = req.headers;
    var manValue = [ access_token ] ;
    var check_blank = commFun.checkBlank(manValue);
    if(check_blank == 1){
        responses.parameterMissing(res);
    } else {
        var table_name = constant.tableName.USER;
        var whereCond = {access_token :access_token }; 
        //++ validate user ++//
        userController.selectQuery(table_name,whereCond).then(function(result){
            if( result.length > 0 ) {
                //++ get watchlist of user ++//
                userController.getWatchlist(result[0]['user_id']).then(function(watchlistResult){
                if( watchlistResult.length > 0 ) responses.success(res,watchlistResult);
                else responses.dataNotFound(res);
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
// remove watchlist
exports.deleteWatchlist = function(req,res){
    var { access_token } = req.headers;
    var { watchlist_id } = req.body;    
    var manValue = [ watchlist_id ];
    var checkBlank = commFun.checkBlank(manValue);
    if( checkBlank == 1 ) { 
        responses.parameterMissing(res);
    } else {       
        var table_name = constant.tableName.USER;
        var userCond = { access_token:access_token };
        userController.selectQuery(table_name,userCond).then(function(result){
            if( result.length > 0 ) {
                var table_name = constant.tableName.WATCHLIST;
                var whereCond = { watchlist_id:watchlist_id };
                userController.deleteQuery(table_name,whereCond).then(function(deleteResult){
                   if( deleteResult.affectedRows > 0 ) {
                        var response = {
                            response : {},
                            message : ' deleted successfully',
                        };
                        res.status('200').json(response);
                   } else {
                        var response = {
                            response : {},
                            message : ' not deleted ',
                        };
                        res.status('200').json(response);
                   }                   
                }).catch(function(error){
                    responses.sendError(res);
                });
            } else responses.invalidToken(res);      
        }).catch(function(error){
            responses.sendError(res);
        });       
    }
};
//add user address
exports.addUserAddress =function(req,res) {
    var { user_id,full_name,mobile_number,house_number,city,landmark,state,country,zip_code } = req.body;
    var manValue = [ user_id,full_name,mobile_number,house_number,city,landmark,state,country,zip_code ] ;
    var check_blank = commFun.checkBlank(manValue);
    if(check_blank == 1){
        responses.parameterMissing(res);
    } else {
        var table_name = constant.tableName.USER_ADDRESS;
        var currentTime = new Date();
        var created_on =  Math.round(currentTime.getTime() / 1000);
        var address_id = md5(currentTime);
        var insertField = {
            address_id:address_id,
            user_id:user_id,
            full_name:full_name,
            mobile_number:mobile_number,
            house_number:house_number,
            city:city,
            landmark:landmark,
            state:state,
            country:country,
            zip_code:zip_code,
            created_on:created_on 
        };        
        userController.insertQuery(table_name,insertField).then(function(result){
           if( result.affectedRows > 0 ) responses.addedSuccessfully(res);
           else responses.notAdded(res);
        }).catch(function(error){ console.log(error); 
            responses.sendError(res);
        });
    }
};
// get user address
exports.getUserAddress = function(req,res){
    var { access_token } = req.headers;
    var { user_id } = req.body;
    var manValue = [ access_token,user_id ];
    var checkBlank = commFun.checkBlank(manValue);
    if( checkBlank ==1 ) {
        responses.parameterMissing(res);
    } else {
        var table_name = constant.tableName.USER;
        var selectField = { access_token:access_token };
        //++ user exist ++//
        userController.selectQuery(table_name,selectField).then(function(userResult){        
            if( userResult.length > 0 ) {
            var selectField = {user_id:user_id};
            var table_name = constant.tableName.USER_ADDRESS;
            //++ get user address ++//
            userController.selectQuery(table_name,selectField).then(function(selectResult){
             responses.success(res,selectResult); 
             }).catch(function(error){
                 responses.sendError(res);
             });
           } else {
               responses.invalidToken(res);
           }
        }).catch(function(error){
            responses.sendError(res);
        });
    }    
};
//add order
exports.addOrder = function(req,res){
    var { watchlist_id } = req.body;
    var { access_token } = req.headers;
    var manValue = [ access_token,watchlist_id ];
    var checkBlank = commFun.checkBlank(manValue);
    if( checkBlank ==1 ) {
        responses.parameterMissing(res);
    } else {
        var table_name = constant.tableName.USER;
        var whereCond = { access_token: access_token };
        userController.selectQuery(table_name,whereCond).then(function(selectUser){
            if( selectUser.length > 0 ) {
                var currentTime = new Date();
                var table_name = constant.tableName.ORDER;
                var order_id = md5(currentTime);
                var order_number = Math.round(currentTime.getTime() / 1000); 
                var created_on = Math.round(currentTime.getTime() / 1000); 
                var insertField = {
                    watchlist_id : watchlist_id,
                    order_id : order_id,
                    order_number : order_number,
                    created_on : created_on
                };
                userController.insertQuery(table_name,insertField).then(function(insertOrder){
                    if( insertOrder.affectedRows > 0 ) {
                        var table_name = constant.tableName.WATCHLIST;
                        var is_payment = 1;
                        var watchlistValue = { is_payment:is_payment };
                        var watchlistCond = { watchlist_id:watchlist_id };
                        userController.updateQuery(table_name,watchlistValue,watchlistCond).then(function(updateWatchlist){
                            if( updateWatchlist.affectedRows > 0 ) { 
                                userController.selectQuery(table_name,watchlistCond).then(function(result){
                                    if( result.length > 0 ) {
                                        userController.updateDiamondStock(result[0].diamond_id).then(function(updateResult){
                                            if( updateResult.affectedRows > 0 ) {
                                              var response = {
                                                    response : {},
                                                    message : 'Your order has been placed.'
                                                };
                                                res.status('200').json(response);
                                            }
                                        }).catch(function(error){console.log(error);
                                            responses.sendError(res);
                                        });
                                    }
                                }).catch(function(error){console.log(error);
                                    responses.sendError(res);
                                });
                            }
                        }).catch(function(error){console.log(error);
                            responses.sendError(res);
                        });
                    }
                }).catch(function(error){console.log(error);
                    responses.sendError(res);
                });
            } else responses.invalidToken(res);
        }).catch(function(error){
            console.log(error);
            responses.sendError(res);
        });
    }
    
    
};
