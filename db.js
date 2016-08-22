var mysql = require('mysql');

// set the mysql properties
var connection = mysql.createConnection({
    
    //set the variables as per your db credentials
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'atlas'
});

//get the connection
connection.connect(function (error) {
    if(!!error){
        console.log('Error');
    }else{
        console.log('connected');
    }
});

module.exports = connection;
