
var userPanel = require('../controllers/user');

exports.default = function(app){
    // create user --signup
    app.route("/user/signUp").post(userPanel.signUp);
    // verify otp 
    app.route("/user/verifyOtp").post(userPanel.verifyOtp);
     // select user -- login
     app.route("/user/login").post(userPanel.login);
    // // user send otp
    app.route("/user/sendOtp").post(userPanel.sendOtp);    
    // // user reset password 
    app.route('/user/resetPassword').post(userPanel.resetPassword);
    // forgot password
    app.route('/user/forgotPassword').post(userPanel.forgotPassword);
    // all diamond detail
    app.route('/user/getDiamondList').post(userPanel.getDiamondList);
    // get a diamond detail
    app.route('/user/getDiamondDetail').post(userPanel.getDiamondDetail);
    // add into wishlist
    app.route('/user/addWatchlist').post(userPanel.addWatchlist);
    // get wishlist
    app.route('/user/getWatchlist').post(userPanel.getWatchlist);
    // remove wishlist
    app.route('/user/removeWatchlist').post(userPanel.deleteWatchlist);
    // add user address
    app.route('/user/addUserAddress').post(userPanel.addUserAddress);
    // get user address
    app.route('/user/getUserAddress').post(userPanel.getUserAddress);
    // add order==
    app.route('/user/addOrder').post(userPanel.addOrder);
    
    return app;
};
