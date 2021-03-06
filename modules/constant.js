/**
 * The node-module to hold the constants for the server
 */

function define(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false,
        configurable: true
    });
}

exports.responseFlags = {};
exports.responseMessages = {};
exports.tableName = {};
//FOR MESSAGES  
define(exports.responseMessages, 'ALREADY_EXIST',                   'Password already exist');
define(exports.responseMessages, 'PARAMETER_MISSING',               'Some parameter missing.');
define(exports.responseMessages, 'INVALID_ACCESS_TOKEN',            'Invalid access token.');
define(exports.responseMessages, 'INVALID_MOBILE_NUMBER',           'Invalid mobile number.');
define(exports.responseMessages, 'MOBILE_NUMBER_ALREADY_EXIST',     'Contact number already exist.');
define(exports.responseMessages, 'INVALID_EMAIL_ID',                'Invalid email id.');
define(exports.responseMessages, 'INVALID_CREDENTIAL',              'Invalid credential.');
define(exports.responseMessages, 'INCORRECT_PASSWORD',              'Incorrect Password.');
define(exports.responseMessages, 'ACTION_COMPLETE',                 'Action complete.');
define(exports.responseMessages, 'LOGIN_SUCCESSFULLY',              'Logged in successfully.');
define(exports.responseMessages, 'SHOW_ERROR_MESSAGE',              'Show error message.');
define(exports.responseMessages, 'IMAGE_FILE_MISSING',              'Image file is missing.');
define(exports.responseMessages, 'ERROR_IN_EXECUTION',              'Error in execution.');
define(exports.responseMessages, 'UPLOAD_ERROR',                    'Error in uploading.');
define(exports.responseMessages, 'STATUS_CHANGED_SUCCESSFULLY',     'Status changed successfully.');
define(exports.responseMessages, 'USER_NOT_FOUND',                  'User not found.');
define(exports.responseMessages, 'USER_NOT_CREATED',                'User not created.');
define(exports.responseMessages, 'NO_DATA_FOUND',                   'No data found.');
define(exports.responseMessages, 'USER_DELETED_SUCCESSFULLY',       'User deleted successfully.');
define(exports.responseMessages, 'PASSWORD_CHANGED_SUCCESSFULLY',   'Password changed successfully.');
define(exports.responseMessages, 'EMAIL_ALREADY_EXISTS',            'Email already registered');
define(exports.responseMessages, 'EMAIL_NOT_EXIST',                 'Email not registered.');
define(exports.responseMessages, 'EXPIRED_TOKEN',                   'This link has been expired.');
define(exports.responseMessages, 'SOCIAL_CREDENTIAL',               'Please enter another details.'); 
define(exports.responseMessages, 'INVALID_OTP',                     'OTP not match.'); 
define(exports.responseMessages, 'OTP_VERIFY',                      'OTP match.'); 
define(exports.responseMessages,  'EMAIL_VERIFY',                   ' OTP has been send to your email');
define(exports.responseMessages,  'ADDED_SUCCESSFULLY',             ' Added Successfully');
define(exports.responseMessages,  'UPDATED_SUCCESSFULLY',           ' Updated Successfully');
define(exports.responseMessages,  'NOT_ADDED',                      ' NOT Added ');
define(exports.responseMessages,  'NOT_UPDATED',                    'NOT Updated ');
define(exports.responseMessages,  'MOBILE_NOT_VERIFY',              'Mobile number not verified');
define(exports.responseMessages,  'MOBILE_NOT_REGISTER',              'Mobile number not registered');
//FOR FLAGS
define(exports.responseFlags, 'ALREADY_EXIST',                       422);
define(exports.responseFlags, 'PARAMETER_MISSING',                   422);
define(exports.responseFlags, 'INVALID_ACCESS_TOKEN',                401);
define(exports.responseFlags, 'INVALID_MOBILE_NUMBER',               403);
define(exports.responseFlags, 'INVALID_CREDENTIAL',                  403);
define(exports.responseFlags, 'INVALID_EMAIL_ID',                    403);
define(exports.responseFlags, 'WRONG_PASSWORD',                      403);
define(exports.responseFlags, 'MOBILE_NUMBER_ALREADY_EXIST',         422);
define(exports.responseFlags, 'ACTION_COMPLETE',                     200);
define(exports.responseFlags, 'LOGIN_SUCCESSFULLY',                  200);
define(exports.responseFlags, 'SHOW_ERROR_MESSAGE',                  400);
define(exports.responseFlags, 'IMAGE_FILE_MISSING',                  422);
define(exports.responseFlags, 'ERROR_IN_EXECUTION',                  404);
define(exports.responseFlags, 'STATUS_CHANGED_SUCCESSFULLY',         200);
define(exports.responseFlags, 'USER_NOT_FOUND',                      203);
define(exports.responseFlags, 'USER_NOT_CREATED',                    203);
define(exports.responseFlags, 'NO_DATA_FOUND',                       203);
define(exports.responseFlags, 'USER_DELETED_SUCCESSFULLY',           200);
define(exports.responseFlags, 'PASSWORD_CHANGED_SUCCESSFULLY',       200);
define(exports.responseFlags, 'SOCIAL_CREDENTIAL',                   200);
define(exports.responseFlags, 'EMAIL_NOT_EXIST',                     403);
define(exports.responseFlags, 'INVALID_OTP',                         401);
define(exports.responseFlags, 'OTP_VERIFY',                          200);
define(exports.responseFlags, 'EMAIL_VERIFY',                        200);
define(exports.responseFlags, 'ADDED_SUCCESSFULLY',                  200);
define(exports.responseFlags, 'UPDATED_SUCCESSFULLY',                200);
define(exports.responseFlags, 'NOT_ADDED',                           203);
define(exports.responseFlags, 'NOT_UPDATED',                         203);
define(exports.responseFlags, 'MOBILE_NOT_VERIFY',                   203);
define(exports.responseFlags, 'MOBILE_NOT_REGISTER',                 203);
// define table name 
//++ USER ++//
define(exports.tableName,'USER', 'tbl_user');
define(exports.tableName,'USER_ADDRESS', 'tbl_user_address');

//++ ADMIN ++//
define(exports.tableName,'ADMIN', 'tbl_admin');

//++ common table ++//
define(exports.tableName,'DIAMOND', 'tbl_admin_diamond');
define(exports.tableName,'WATCHLIST', 'tbl_watchlist');
define(exports.tableName,'ORDER', 'tbl_order');

