var mysql      = require('mysql');

// set the mysql properties
var connection = mysql.createConnection({
    
    //set the variables as per your db credentials
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'atlas'
});

module.exports = connection;
