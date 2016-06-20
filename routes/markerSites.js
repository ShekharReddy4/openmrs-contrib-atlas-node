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
connection.connect(function (error) {
    if(!!error){
        console.log('Error');
    }else{
        console.log('connected');
    }
});

/* GET all the markerSites */
router.get('/markerSites', function(req, res, next) {
    
    connection.query("SELECT * FROM atlas", function (error, rows, field) {
        if(!!error){
            console.log('error');
        }
        else{
            console.log(rows[1]);
            connection.end();
        }
    });
    
    //jus for now, i should chnage this later
    res.render('index', { title: 'OpenMRS Atlas' });
    
});

module.exports = router;