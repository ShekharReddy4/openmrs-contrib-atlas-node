var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', {
      title: 'OpenMRS Atlas'
    });
  //  console.log(((req.query.zoom)*1) + req.query.clusters+req.query.legend )

});

module.exports = router;
