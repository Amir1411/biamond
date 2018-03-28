var connection = require('../modules/connection');
var message = require('../modules/message');
var md5 = require("md5"); 
// sign up
exports.userCreate = function(req,callback) {
    var { email,password,contact_number, device_type,device_token,latitude,longitude } = req.body;
    var user_id = md5(new Date());
    var access_token = md5(new Date());
    var ency_pass = md5(password);
    var currentTime = new Date();
    var created_on = Math.round(currentTime.getTime() / 1000);
    var select_query = "SELECT row_id FROM `tbl_user` WHERE `mobile`=?";
    connection.query(select_query,[contact_number], function(selectErr,selectResult){
        if(selectResult.length > 0){
           callback (1);
        } else {
            var sql_query = "INSERT INTO `tbl_user`(user_id, access_token, email, password, mobile,device_type, device_token, latitude, longitude, created_on) VALUES (?,?,?,?,?,?,?,?,?,?) ";
            connection.query(sql_query,[user_id, access_token, email, ency_pass, contact_number, device_type, device_token, latitude, longitude, created_on],function(err,result){
                if(err) {
                   callback (2);
                } else {
                    var user_sql = "SELECT * FROM `tbl_user` WHERE `user_id`=?";
                    connection.query(user_sql, [user_id], function(userErr, userResult) {
                        if (userErr) {
                            callback(3);
                        } else {
                            callback(userResult);
                        }
                    });
                }
            });
        }
    });

};
// user login
exports.userLogin = function(req,callback) {
	var { contact_number,password,device_type,device_token,latitude,longitude } = req.body;
	var ency_pass = md5(password);
    var sql_query = "SELECT * FROM `tbl_user` WHERE `mobile`=? AND `password`=?";
    connection.query(sql_query,[ contact_number, ency_pass],function(err,result){
        if(err) {
           callback(1);
        } else {
            if(result.length > 0) {
                var access_token = md5(new Date());
                var update_sql = "UPDATE `tbl_user` SET `access_token`=?, `device_type`=?, `device_token`=?, `latitude`=?, `longitude`=? WHERE `user_id`=?";
                connection.query(update_sql, [access_token, device_type, device_token, latitude, longitude, result[0]["user_id"]], function(err, userResult){
                    if (err) {
                        callback(3);
                    } else {
                        result[0]["access_token"] = access_token;
                        result[0]["device_type"] = device_type;
                        result[0]["device_token"] = device_token;
                        result[0]["latitude"] = latitude;
                        result[0]["longitude"] = longitude;
                        result[0]["password"] = "";
                        callback(result);
                    }
                });
            } else {
                callback(2);						
            }
        }

    });
	
};
// user send otp on mobile
exports.userSendOtp = function (req,callback) {
    var {contact_number} = req.body;      
    var sql_query = " SELECT `row_id` FROM `tbl_user` WHERE `mobile`=?";
    connection.query(sql_query, [contact_number], function(err,result){
        if(err){
            callback(1);
        } else {
            if(result.length > 0){
                var  otp = commFun.generateRandomString();
                message.sendOTP(contact_number, otp);
            }
        }
    });    
};
// user reset password
exports.userResetPassword = function (req,callback) {
    var {access_token} =req.headers;
    var {password} = req.body;    
    var ency_pass = md5(password);
    var update_query = "UPDATE `tbl_user` SET `password`=? WHERE `access_token`=?";
    connection.query(update_query,[ency_pass,access_token], function(err,result){
        if(err){
            callback(1); 
        } else {
            callback(2);
        }
    });
};


