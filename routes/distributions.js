var express = require('express');
var router = express.Router();

module.exports = function(connection) {
    /* GET all the distributions */
    router.get('/distributions', function(req, res, next) {

        connection.query("SELECT * FROM distributions", function (error, rows, field) {
            if(!!error){
                console.log('error');
            }
            else{
                //var data  = JSON.stringify(rows);
                res.setHeader('Content-Type', 'application/json');
                res.json(rows);
            }
        });
    });
    return router;
};
