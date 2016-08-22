var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = function(){
    router.get('/', function(req, res, next) {

        res.render('index', {
            title: 'OpenMRS Atlas',
            isAuth: req.session,
            user: req.session.user
        });

    });
    
    return router;
};

