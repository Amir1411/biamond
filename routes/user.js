
var userPanel = require('../controllers/user');

exports.default = function(app){
    // create user --signup
    app.route("/user/signUp").post(userPanel.signUp);
     // select user -- login
     app.route("/user/login").post(userPanel.login);
    // // user send otp
    app.route("/user/sendOtp").post(userPanel.sendOtp);    
    // // user reset password 
    app.route('/user/resetPassword').post(userPanel.resetPassword);
    // all diamond detail
    app.route('/user/getDiamondDetails').post(userPanel.getDiamondDetails);
    // add into wishlist
    app.route('/user/addWishlist').post(userPanel.addWishlist);
    // get wishlist
    app.route('/user/getWishlist').post(userPanel.getWishlist);
    // remove wishlist
    app.route('/user/removeWishlist').post(userPanel.deleteWishlist);
    // add user address
    app.route('/user/getUserAddress').post(userPanel.getUserAddress);
    
    return app;
};
