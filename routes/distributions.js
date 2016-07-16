var express = require('express');
var router = express.Router();
var mysql      = require('mysql');

// set the mysql properties
var connection = mysql.createConnection({
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

/* GET all the distributions */
router.get('/distributions', function(req, res, next) {

    connection.query("SELECT * FROM distributions", function (error, rows, field) {
        if(!!error){
            console.log('error');
            //connection.end();
        }
        else{
            //var data  = JSON.stringify(rows);
            res.setHeader('Content-Type', 'application/json');
            res.json(rows);
            //console.log(JSON.stringify(rows));
            //connection.end();
        }
    });
    
});

module.exports = router;