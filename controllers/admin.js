var commFun = require('../modules/commonFunction');
var responses = require('../modules/response'); 
var adminQuery = require('../modals/admin');

exports.login = function(req,res) {
    var { email,password } = req.body;
    var manValue = [email,password];
    var checkBlank = commFun.checkBlank(manValue);
    if( checkBlank == 1 ) {
        responses.parameterMissing(res);
    } else {
        adminQuery.adminLogin(req,function(result){
            if( result == 1 || result == 2 ) {
                responses.sendError(res);
            } else if( result == 3 ) {
                responses.invalidCredential(res);
            } else {
               responses.success(res, result[0]);              
            }
        });
    }
};

exports.stoneColor = function(req,res){
    var { stone_color_name } = req.body;
    var manValue = [ stone_color_name ]; 
    var checkBlank = commFun.checkBlank(manValue);
    if(checkBlank == 1 ) {
        responses.parameterMissing(res);
    } else {
        adminQuery.insertStoneColor(req,function(result){
            if( result == 1) {
                var response = {
                    response: {},
                    message: stone_color_name+' color already exist'
                };
                res.status('422').json(response);
            } else if(result == 2) {
                responses.sendError(res);
            } else {
                responses.success(res,result[0]);
            }
        });
    }
};

exports.stoneType = function(req,res){
    var { stone_type_name } = req.body;
    var manValue = [ stone_type_name ]; 
    var checkBlank = commFun.checkBlank(manValue);
    if(checkBlank == 1 ) {
        responses.parameterMissing(res);
    } else {
        adminQuery.insertStoneType(req,function(result){
            if( result == 1) {
                var response = {
                    response: {},
                    message: stone_type_name+' Type already exist'
                };
                res.status('422').json(response);
            } else if( result == 2) {
                responses.sendError(res);
            } else {
                responses.success(res,result[0]);
            }
        });
    }
}

exports.stoneShape = function(req,res){
    var {stone_shape_name} =req.body;
    var manValue = [ stone_shape_name ]; 
    var checkBlank = commFun.checkBlank(manValue);
    if(checkBlank == 1 ) {
        responses.parameterMissing(res);
    } else {
        adminQuery.insertStoneShape(req,function(result){
            if(result ==1 ) {
            var response = {
                response: {},
                message: stone_shape_name+' Shape already exist'
            };
            res.status('422').json(response);
            }  else if( result == 2 ) {
                responses.sendError(res);
            } else {
                responses.success(res,result[0]);
            }    
        });
    }
}