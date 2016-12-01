var express = require('express');
var router = express.Router();

var Multipass = require('atlas-node-multipass');
var apikey = '1234567890abcdef';
var sitekey = 'localhost';
var multipass = new Multipass(apikey, sitekey);

module.exports = function () {
    //GET login
    router.get('/login', function(req, res, next) {

        res.redirect('http://localhost:3001/authenticate/atlas');
    });

    router.get('/auth/multipass/callback', function (req, res) {

        var token = req.query.multipass;
        var obj = multipass.decode(token);
        //console.log(obj);
        req.session.authenticated = true;
        req.session.user = obj;
        res.redirect('/');
        
    });
    
    router.get('/logout', function (req, res) {
        req.session.destroy();
        res.redirect('/');
    });
    
    return router;
};
