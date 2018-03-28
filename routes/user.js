
var userPanel = require('../controllers/user');

exports.default = function(app){
    // create user --signup
    app.route("/user/signUp").post(userPanel.signUp);
     // select user -- login
     app.route("/user/login").post(userPanel.login);
    // // user send otp
    app.route("/user/sendOtp").post(userPanel.sendOtp);    
    // // user reset password 
     app.route('/user/restPassword').post(userPanel.restPassword); 
    return app;
};
