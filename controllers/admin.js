var commFun = require('../modules/commonFunction');
var responses = require('../modules/response'); 
var adminQuery = require('../modals/admin');
var constants = require('../modules/constant'); 
var md5 = require('md5');
//login
exports.login = function(req,res) {
    var { email, password } = req.body;
    var manValue = [ email, password ];
    var checkBlank = commFun.checkBlank(manValue);
    if( checkBlank == 1 ) {
        responses.parameterMissing(res);
    } else {
        var ency_pass = md5(password);    
        var table_name = constants.tableName.ADMIN;    
        // ++ user exists ++//
        adminQuery.checkEmailPassword(email,ency_pass).then(function(result){
            if( result.length > 0 ) {
                var access_token = md5(new Date());
                var updateValue = { access_token:access_token };
                var whereCond = { row_id :result[0]['row_id']};
                //++ update user ++//
                adminQuery.updateQuery(table_name,updateValue,whereCond).then(function(updateResult){
                    result[0]['access_token'] = access_token;
                    result[0]['password'] = "";
                    responses.success(res, result[0]);
                }).catch(function(error){
                    console.log(error);
                    responses.sendError(res);
                });                
            }  else responses.invalidCredential(res);
        }).catch(function(error){ console.log(error);
            responses.sendError(res);
        });
    }
};
// get all user details
exports.getUserList = function(req,res){
    var { access_token } = req.headers;
    var whereCond = { access_token: access_token };
    var table_name = constants.tableName.ADMIN;
    //++ admin user exist ++//
    adminQuery.selectQuery(table_name,whereCond).then(function(result){
       if( result.length > 0 ) {
            var user_table_name = constants.tableName.USER;
            var selectCond = {};
            //++ get all user list ++//
            adminQuery.selectQuery(user_table_name,selectCond).then(function(userResult){                           
                if( userResult.lenght  > 0 ) responses.success(res,userResult);
                else responses.dataNotFound(res);
            }).catch(function(error){               
                responses.sendError(res);
            });
       } else responses.invalidToken(res);
   }).catch(function(error){console.log(error);
        responses.sendError(res);
   });
};
// remove/delete user
exports.removeUser = function (req,res) {
   var { access_token } = req.headers;
   var { user_id } = req.body;
   var manValue = [ access_token ];
   var checkBlank = commFun.checkBlank(manValue);
   if( checkBlank == 1 ) {
    responses.parameterMissing(res);
   } else {
        var table_name = constants.tableName.ADMIN;
        var whereCond = {access_token:access_token};
        adminQuery.selectQuery(table_name,whereCond).then(function(result){
        if( result.length > 0 ) {
            var table_name = constants.tableName.USER;
            var whereCond = {user_id:user_id};
            adminQuery.deleteQuery(table_name,whereCond).then(function(deleteResult){
              if(deleteResult.affectedRows > 0) {
                var response = {
                    response :{},
                    message : 'deleted successfully'
                };
                res.status('200').json(response);
              } else {
                var response = {
                    response :{},
                    message : 'not deleted '
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
// insert diamond detail
exports.addDiamond = function (req,res) {
    var { access_token } = req.headers;
    var { diamond_name,clarity,carat,shape,color,grading,cut,appearance,original_price,current_price,size,stone,quantity } = req.body;
    var manValue = [ diamond_name,clarity,carat,shape,color,grading,cut,appearance,original_price,current_price,size,stone,quantity ];
    var checkBlank = commFun.checkBlank(manValue);
    if( checkBlank == 1 ) {
     responses.parameterMissing(res);
    } else {
        var table_name = constants.tableName.ADMIN;
        var whereCond = {access_token:access_token};
        adminQuery.selectQuery(table_name,whereCond).then(function(result){
            if(result.length > 0 ){
                var created_on = md5(new Date());
                var table_name = constants.tableName.DIAMOND;
                var insertField = {
                    diamond_name:diamond_name,
                    clarity:clarity,
                    carat:carat,
                    shape:shape,
                    color:color,
                    grading:grading,
                    cut:cut,
                    appearance:appearance,
                    original_price:original_price,
                    current_price:current_price,
                    size:size,
                    stone:stone,
                    quantity:quantity,
                    created_on:created_on
                }
                adminQuery.insertDiamond(table_name,insertField).then(function(insertResult){
                    if( insertResult.affectedRows >0 ) responses.addedSuccessfully(res);
                    else responses.notAdded(res);
                });
            } else responses.invalidToken(res);
        });
       
    }
};