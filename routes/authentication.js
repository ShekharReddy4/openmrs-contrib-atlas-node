var Multipass = require('multipass');

var express = require('express');
var router = express.Router();


//GET login
router.get('/login', function(req, res, next) {

    res.redirect('http://mockid.com:3000/');
});

module.exports = router;

var apikey = '1234567890abcdef';
var sitekey = 'localhost';
//var apikey = 'API-KEY';
//var sitekey = 'SITE-KEY';
var multipass = new Multipass(apikey, sitekey);

router.get('/auth/multipass/callback', function (req, res, next) {
    
    res.redirect('http://localhost:3001/');
});