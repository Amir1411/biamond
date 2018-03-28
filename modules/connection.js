var mysql = require('mysql');

var config = {
	host:"localhost",
	user:"root",
	password:"root",
	database:"biamond",
	port:3306
};

const connection = mysql.createConnection(config);

connection.connect(function(err){
	if(err)
		console.log('wrong Databse connection',err);
	else console.log('connected!!');
});

module.exports=connection;
