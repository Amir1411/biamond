
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var glob = require('glob');
var path = require('path');
var chalk = require('chalk');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const initRoutes = function(app) {
    glob('./routes/*.js',{ cwd: path.resolve("./")},function(err,routes){
    if(err) console.log(chalk.red("Error occured including routes"));
    routes.forEach( function(routePath) {
        require(routePath).default(app);
    });
    console.log(chalk.green("included " + routes.length + " route files"));
    });   
};

app.listen('3000', function() {
    console.log('server is running');
}); 

initRoutes(app);
exports.default = app;