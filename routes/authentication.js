var express = require('express');
var router = express.Router();

var Multipass = require('atlas-node-multipass');
var apikey = '1234567890abcdef';
var sitekey = 'localhost';
var multipass = new Multipass(apikey, sitekey);

/*
function ensureAuthenticated(req,res,next){
    if (req.session.authenticated && req.session && req.session.user){
        next();
    }else{
        res.sendStatus(403);
    }
}
*/

//GET login
router.get('/login', function(req, res, next) {

    res.redirect('http://localhost:8080/authenticate/atlas');
});

router.get('/auth/multipass/callback', function (req, res) {

    var token = req.query.multipass;
    var obj = multipass.decode(token);
    //console.log(obj);
    req.session.authenticated = true;
    req.session.user = obj;
    res.redirect('/');
});

module.exports = router;