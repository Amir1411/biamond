var connection = require('../modules/connection');
var Promises = require('promise');
exports.checkEmailPassword = function(email,ency_pass,callback) {
    return new Promises(function(resolve,reject){
    var sql_query = "SELECT * FROM `tbl_admin` WHERE `email`=? AND `password`=?";
        connection.query(sql_query,[ email, ency_pass],function(err,result){
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