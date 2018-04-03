var connection = require('../modules/connection');
var md5 = require('md5');

// login 
exports.adminLogin =function(req,callback){
    var { email, password } = req.body;
    var access_token = md5(new Date());    
    var ency_pass = md5(password);
    var select_query = "SELECT * FROM `tbl_admin` WHERE `email`=? AND `password`=?";
    connection.query(select_query,[email, ency_pass],function(err,result){
        if(err) {
            callback(1);
        } else {
            if( result.length > 0 ) {
                var update_query = " UPDATE `tbl_admin` SET `access_token`=? WHERE `row_id`=?";
                connection.query(update_query,[access_token,result[0]['row_id']],function(err,upadteResult){
                    if(err){
                            callback(2);
                    } else {
                        result[0]['access_token'] = access_token;
                        result[0]['password'] = "";
                        callback(result);
                    }
                });
                
            } else {
                callback(3);
            }
        }
    });
};
// insert stone color==
exports.insertStoneColor = function(req,callback){   
    var { stone_color_name } = req.body;
    var select_color = " SELECT * FROM `tbl_admin_stone_color` WHERE `stone_color_name`=?";
    connection.query(select_color,[stone_color_name],function(colorErr,colorResult){
        if(colorResult.length > 0){           
            callback(1);
        } else {
            var currentTime = new Date();
            var stone_color_id = md5(currentTime);
            var created_on = Math.round(currentTime.getTime() / 1000);
            
            var insert_sql = "INSERT INTO `tbl_admin_stone_color` (stone_color_id,stone_color_name,created_on) VALUES (?,?,?)";
            connection.query(insert_sql,[stone_color_id,stone_color_name,created_on],function(err, result){
                if(err) {
                   callback(2); 
                } else {
                    var select_query = "SELECT * FROM `tbl_admin_stone_color` WHERE `stone_color_id`=?"
                    connection.query(select_query,[stone_color_id],function(selectErr,selectResult){
                        if(selectResult.length > 0) {                            
                            callback(selectResult);
                        }
                    });
                }
            });
        }
    });
};
// insert stone type
exports.insertStoneType = function(req,callback){
    var { stone_type_name } = req.body;    
    var select_type = " SELECT * FROM `tbl_admin_stone_type` WHERE `stone_type_name`=?";
    connection.query(select_type,[stone_type_name],function(typeErr,typeResult){
        if(typeResult.length > 0){
            callback(1);           
        } else {
            var currentTime = new Date();
            var stone_type_id = md5(currentTime);
            var created_on = Math.round(currentTime.getTime() / 1000);                
            var insert_sql = "INSERT INTO `tbl_admin_stone_type` (stone_type_id,stone_type_name,created_on) VALUES (?,?,?)";
            connection.query(insert_sql,[stone_type_id,stone_type_name,created_on],function(err, result){
                if(err) {
                    callback(2);
                } else {
                    var select_query = "SELECT * FROM `tbl_admin_stone_type` WHERE `stone_type_id`=?"
                    connection.query(select_query,[stone_type_id],function(selectErr,selectResult){
                        if(selectResult.length > 0) {
                            callback(selectResult);
                        }
                    });
                }
            });
        }
    });
};
// insert stone Shape
exports.insertStoneShape = function(req,callback){
    var { stone_shape_name } = req.body;  
    var select_shape = " SELECT * FROM `tbl_admin_stone_shape` WHERE `stone_shape_name`=?";
    connection.query(select_shape,[stone_shape_name],function(shapeErr,shapeResult){
        if(shapeResult.length > 0){        
            callback(1);
        } else {
            var currentTime = new Date();
            var stone_shape_id = md5(currentTime);
            var created_on = Math.round(currentTime.getTime() / 1000);
            
            var insert_sql = " INSERT INTO `tbl_admin_stone_shape` (stone_shape_id,stone_shape_name,created_on) VALUES (?,?,?)";
            connection.query(insert_sql,[stone_shape_id,stone_shape_name,created_on],function(err, result){
                if(err) { console.log(err);
                 callback(2);   
                } else {
                    var select_query = " SELECT * FROM `tbl_admin_stone_shape` WHERE `stone_shape_id`=?"
                    connection.query(select_query,[stone_shape_id],function(selectErr,selectResult){
                        if(selectResult.length > 0) {
                          callback(selectResult);  
                        }
                    });
                }
            });
        }
    });    
};
// user details 
exports.userDetails = function(req,callback){
   var {access_token} = req.headers;
   var select_admin = "SELECT * FROM `tbl_admin` WHERE `access_token` =?";
    connection.query(select_admin,access_token,function(err,result){
        if(err) callback(1);
        else {
            if(result.length > 0) {               
                var select_user = " SELECT * FROM `tbl_user` ORDER BY `row_id` DESC";
                connection.query(select_user,function(err,result){
                    if(err) callback(3); 
                    else callback(result);
                });
            } else {
                callback(2);
            }
        }
    });
};
// delete user
 exports.removeUser = function(req,callback) {
    var {access_token} = req.headers;
    var delete_query =" DELETE FROM `tbl_user` WHERE `access_token`=?";
    connection.query(delete_query,[access_token],function(err,result){
        if(err) callback(1);
        else callback(2);
    });
 };
// insert diamond details
exports.insertDiamond = function(req,callback){
    var { diamond_name,clarity,carat,shape,color,grading,cut,appearance,original_price,current_price,size,stone,quantity } = req.body;
    var currentTime = new Date();
    var access_token = md5(currentTime);
    var diamond_id = md5(currentTime);
    var created_on = Math.round(currentTime.getTime() / 1000); 
    var bia_no = 12345;    
    var insert_query = " INSERT INTO `tbl_diamond_detail` SET `access_token`=? , `diamond_id`=?, `diamond_name`=?, `clarity`=?, `carat`=?, `shape`=?, `color`=?, `grading`=?, `cut`=?, `appearance`=?, `original_price`=?, `current_price`=?, `size`=?, `stone`=?, `bia_no`=?, `quantity`=?, `created_on`=?";
    connection.query(insert_query, [access_token,diamond_id,diamond_name,clarity,carat,shape,color,grading,cut,appearance,original_price,current_price,size,stone,bia_no,quantity,created_on], function(err,result){
        if(err) {
            callback(1);
        } else {            
            var select_query = "SELECT * FROM `tbl_diamond_detail` WHERE `access_token`= ?";
            connection.query(select_query,[access_token], function(selectErr,selectResult){
                if(selectResult.length > 0) {
                    callback(selectResult);
                }  else {
                    callback(2);
                }
            }); 
           }          
    });
};
