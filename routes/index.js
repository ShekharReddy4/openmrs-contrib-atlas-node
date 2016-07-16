var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'OpenMRS Atlas',
    site: req.query.site,
    positioin: req.query.position,

  });
});

module.exports = router;
