var Multipass = require('atlas-node-multipass');
var apikey = '1234567890abcdef';
var sitekey = 'localhost';
var multipass = new Multipass(apikey, sitekey);

var express = require('express');
var router = express.Router();

//GET login
router.get('/login', function(req, res, next) {

    res.redirect('http://mockid.com:3000/');
});

module.exports = router;
router.get('/auth/multipass/callback', function (req, res, next) {
    
    var token = req.query.multipass;
    var obj = multipass.decode(token);
    res.redirect('http://localhost:3001/');
});