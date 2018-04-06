var connection = require('../modules/connection');
var commFun = require('../modules/commonFunction');
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
// select watchlist 
exports.selectWatchlist = function(user_id,diamond_id,callback){
    return new Promises(function(resolve,reject){
        var select_query = " SELECT * FROM `tbl_watchlist` WHERE `user_id`=? AND `diamond_id`=?";
        connection.query(select_query,[user_id,diamond_id],function(err,result){
            err ? reject(err) : resolve(result); 
        });
    });
};
//update watchlist
exports.updateWatchlist = function(quantity,price,user_id,diamond_id,callback){
    return new Promises(function(resolve,reject){
        var update_query = " UPDATE `tbl_watchlist` SET `quantity`=?, `price`=? WHERE `user_id`=? AND `diamond_id`=?";
        connection.query(update_query,[quantity,price,user_id,diamond_id],function(err,result){
            err ? reject(err) : resolve(result);
        });
    });
};
// get watchlist of user
exports.getWatchlist = function(user_id,callback){
    return new Promises(function(resolve,reject){
    var select_user = " SELECT * FROM `tbl_watchlist` WHERE `user_id`=? AND `is_payment`=0 ORDER BY `row_id` DESC";
    connection.query(select_user,[user_id],function(err,result){
       err ? reject(err) : resolve(result);            
     });
    });
};
exports.selectQuery = function(table_name,value,callback) {
    return new Promises(function(resolve,reject){
       
        if ( Object.keys(value).length > 0 ) {
            var sql = "SELECT * FROM " +table_name+" WHERE ?  ORDER BY `row_id` DESC";
            var el = [value];
        } else {
            var sql = "SELECT * FROM " +table_name + " ORDER BY `row_id` DESC";
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