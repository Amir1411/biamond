
var adminPanel = require('../controllers/admin');

exports.default = function(app){
    //  select admin -- login
    app.route("/admin/login").post(adminPanel.login)   
    //  user reset password 
    //  app.post('/admin/restPassword').post(user.restPassword); 
    // admin insert stone color
    app.route('/admin/stoneColor').post(adminPanel.stoneColor);
    // admin insert stone type
    app.route('/admin/stoneType').post(adminPanel.stoneType);
    // admin insert stone shape
    app.route('/admin/stoneShape').post(adminPanel.stoneShape);
    return app;
};
