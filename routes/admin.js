var adminPanel = require('../controllers/admin');

exports.default = function(app){
    //  select admin -- login
    app.route("/admin/login").post(adminPanel.login)   
    //  user reset password 
    //  app.post('/admin/restPassword').post(user.restPassword);  
    // user List
    app.route('/admin/getUserList').post(adminPanel.getUserList);
    // remove or delete user
    app.route('/admin/removeUser').post(adminPanel.removeUser);
    // add diamond
    app.route('/admin/addDiamond').post(adminPanel.addDiamond);
        
    return app;
};
