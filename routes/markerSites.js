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

//get the conncetion
connection.connect();

/* GET all the markerSites */
router.get('/', function(req, res, next) {

    connection.query("select * from atlas", function (error, rows, field) {
        if(!!error){
            throw err;
        }
        else{
            console.log(rows);
        }
    });

    res.render('index', { title: 'OpenMRS Atlas' });
});

module.exports = router;



