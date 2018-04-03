var connection = require('../modules/connection');
var commFun = require('../modules/commonFunction');
var message = require('../modules/message');
 
var Promises = require('promise');
// user login
exports.userLogin = function(mobile_number,ency_pass,callback) {
    return new Promises(function(resolve,reject){
    var sql_query = "SELECT * FROM `tbl_user` WHERE `mobile_number`=? AND `password`=?";
        connection.query(sql_query,[ mobile_number, ency_pass],function(err,result){
            err ? reject(err) : resolve(result);
        });
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
// select wishlist 
exports.selectWishlist = function(user_id,diamond_id,callback){
    return new Promises(function(resolve,reject){
        var select_query = " SELECT * FROM `tbl_wishlist` WHERE `user_id`=? AND `diamond_id`=?";
        connection.query(select_query,[user_id,diamond_id],function(err,result){
            err ? reject(err) : resolve(result); 
        });
    });
};
//update wishlist
exports.updateWishlist = function(quantity,price,user_id,diamond_id,callback){
    return new Promises(function(resolve,reject){
        var update_query = " UPDATE `tbl_wishlist` SET `quantity`=?, `price`=? WHERE `user_id`=? AND `diamond_id`=?";
        connection.query(update_query,[quantity,price,user_id,diamond_id],function(err,result){
            err ? reject(err) : resolve(result);
        });
    });
};
// get wishlist of user
exports.getWishlist = function(user_id,callback){
    return new Promises(function(resolve,reject){
    var select_user = " SELECT * FROM `tbl_wishlist` WHERE `user_id`=? AND `is_payment`=0 ORDER BY `row_id` DESC";
    connection.query(select_user,[user_id],function(err,result){
       err ? reject(err) : resolve(result);            
     });
    });
};
// get user address 
exports.addUserAddress = function(req,callback){
    var { user_id,full_name,mobile_number,house_number,city,landmark,state,country,zip_code } = req.body;
    var currentTime = new Date();
    var created_on =  Math.round(currentTime.getTime() / 1000);
    var address_id = md5(currentTime);
    var insert_query = "INSERT INTO `tbl_user_address` SET `address_id`=?,`user_id`=?, `full_name`=?,`mobile_number`=?,`house_number`=?,`city`=?,`landmark`=?,`state`=?,`country`=?,`zip_code`=?,`created_on`=?";
    connection.query(insert_query,[ address_id,user_id,full_name,mobile_number,house_number,city,landmark,state,country,zip_code,created_on ],function(err,result){
        if(err)  callback(1);  else  callback(2);
    });
};
// get user address
exports.getUserAddress = function(req,callback){
    var {access_token,user_id} = req.headers;
   var select_user = "SELECT * FROM `tbl_user` WHERE `access_token` =?";
    connection.query(select_user,access_token,function(err,result){
        if(err) callback(1);
        else {
            if(result.length > 0) {               
                var select_query = " SELECT * FROM `tbl_user_address` WHERE `user_id`=? ORDER BY `row_id` DESC";
                connection.query(select_query,[ user_id ],function(err,result){
                    if(err) callback(3); 
                    else callback(result);
                });
            } else {
                callback(2);
            }
        }
    });

};
exports.selectQuery = function(table_name,value,callback) {
    return new Promises(function(resolve,reject){
        if ( value.length > 0 ) {
            var sql = "SELECT * FROM " +table_name+" WHERE ?";
            var el = [value];
        } else {
            var sql = "SELECT * FROM " +table_name;
            var el = [];
        }        
        connection.query(sql, el, function(err, result){
            err ? reject(err) : resolve(result);
        });
    });
};
exports.insertQuery = function(table_name,value,callback) {
    return new Promises(function(resolve,reject){
        var sql = " INSERT INTO "+table_name+" SET ? ";
        connection.query(sql, [value], function(err, result){
            err ? reject(err) : resolve(result); 
        });
    });
};
exports.updateQuery = function(table_name,value,whereCond,callback){
    return new Promises(function(resolve,reject){
        var sql = " UPDATE "+table_name+" SET ? WHERE ?";
        connection.query(sql, [value,whereCond],function(err, result){
            err ? reject(err) : resolve(result); 
        });
    });
};
exports.deleteQuery = function(table_name,whereCond,callback){
    return new Promises(function(resolve,reject){
        var sql = " DELETE  FROM "+table_name+" WHERE ?";
        connection.query(sql, [whereCond],function(err, result){
            err ? reject(err) : resolve(result); 
        });
    });
};

